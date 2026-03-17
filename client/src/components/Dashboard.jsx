import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import MetricCard from './MetricCard';
import { useQueries } from '../hooks/useQueries';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const categoryColors = {
  'Order Tracking': '#3B82F6',
  'Delivery Delay': '#F59E0B',
  'Refund Request': '#F87171',
  'Product Complaint': '#A78BFA',
  'General Query': '#94A3B8',
  'Payment Failure': '#FB923C',
  'Subscription Issue': '#2DD4BF'
};

const defaultCategories = Object.keys(categoryColors);

const CustomLegend = ({ items }) => (
  <div className="flex flex-wrap justify-center gap-4 mt-6">
    {items.map(item => (
      <div key={item.label} className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
        <span className="text-sm text-[#DDE6F4]">{item.label}</span>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const { queries } = useQueries();

  const {
    totalQueries,
    topIssue,
    doughnutData,
    barData,
    legendItems
  } = useMemo(() => {
    const total = queries.length;
    const catCounts = {};
    defaultCategories.forEach(cat => catCounts[cat] = 0);
    
    queries.forEach(q => {
      if (catCounts[q.category] !== undefined) {
        catCounts[q.category]++;
      }
    });

    let maxCount = 0;
    let topCat = '';
    
    const countsArray = [];
    const labelsArray = [];
    const colorsArray = [];

    defaultCategories.forEach(cat => {
      const cnt = catCounts[cat];
      labelsArray.push(cat);
      countsArray.push(cnt);
      colorsArray.push(categoryColors[cat]);
      if (cnt > maxCount) {
        maxCount = cnt;
        topCat = cat;
      }
    });

    const topPct = total > 0 ? ((maxCount / total) * 100).toFixed(1) : 0;
    
    const dData = {
      labels: labelsArray,
      datasets: [{
        data: countsArray,
        backgroundColor: colorsArray,
        borderWidth: 0,
        cutout: '75%'
      }]
    };

    const bData = {
      labels: labelsArray,
      datasets: [{
        data: countsArray,
        backgroundColor: colorsArray,
        borderRadius: 4
      }]
    };

    const lItems = labelsArray.map((label, idx) => ({
      label,
      color: colorsArray[idx]
    }));

    return {
      totalQueries: total,
      topIssue: { name: topCat || 'N/A', pct: topPct },
      doughnutData: dData,
      barData: bData,
      legendItems: lItems,
      catCounts
    };
  }, [queries]);

  const rawManualMins = totalQueries * 4.2 * 60;
  const rawAiMins = totalQueries * 2;
  const rawSavedMins = rawManualMins - rawAiMins;

  const formatHoursMins = (totalMins) => {
    const h = Math.floor(Math.abs(totalMins) / 60);
    const m = Math.floor(Math.abs(totalMins) % 60);
    return `${h} hrs ${m} mins`;
  };

  const manualTimeStr = formatHoursMins(rawManualMins);
  const aiTimeStr = `${Math.floor(rawAiMins)} mins`;
  const savedTimeStr = formatHoursMins(rawSavedMins);

  const autoResolved = Math.floor(totalQueries * 0.73);
  const agentHoursSaved = (autoResolved * 0.07).toFixed(1);
  const costSaved = Math.floor(agentHoursSaved * 350);

  const slaTargets = {
    'Order Tracking': 2,
    'Delivery Delay': 4,
    'Refund Request': 24,
    'Payment Failure': 1
  };

  const getSlaRisk = (category) => {
    const catQueries = queries.filter(q => q.category === category);
    if (!catQueries.length) return { risk: 0, status: 'Safe', color: 'bg-green-500', textColor: 'text-green-500' };
    
    const breachQueries = catQueries.filter(q => q.priority === 'urgent' || q.priority === 'high');
    const riskPct = Math.round((breachQueries.length / catQueries.length) * 100);
    
    if (riskPct > 70) return { risk: riskPct, status: 'Critical', color: 'bg-red-500', textColor: 'text-red-500' };
    if (riskPct >= 40) return { risk: riskPct, status: 'At Risk', color: 'bg-orange-500', textColor: 'text-orange-500' };
    return { risk: riskPct, status: 'Safe', color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const heatmapData = useMemo(() => {
    const days = 7;
    const hours = 24;
    const grid = [];
    
    for (let d = 0; d < days; d++) {
      const row = [];
      for (let h = 0; h < hours; h++) {
        let val = Math.floor(Math.random() * 5); // night default 0-4
        if (h >= 9 && h <= 19 && d < 5) {
          val = Math.floor(Math.random() * 18) + 8; // weekday biz hours 8-25
        }
        if ((d === 0 || d === 1) && h >= 9 && h <= 11) {
          val += 10; // monday/tuesday morning spike
        }
        row.push(val);
      }
      grid.push(row);
    }
    return grid;
  }, []);

  const getHeatmapColor = (val) => {
    if (val === 0) return '#0B0F1A';
    if (val <= 5) return '#0D2A2A';
    if (val <= 12) return '#0F4040';
    if (val <= 20) return '#0A7A6A';
    return '#00C9A7';
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Order Tracking',
        data: [42, 38, 45, 50, 44, 52],
        borderColor: categoryColors['Order Tracking'],
        backgroundColor: categoryColors['Order Tracking'],
        tension: 0.4
      },
      {
        label: 'Delivery Delay',
        data: [25, 30, 28, 32, 29, 38],
        borderColor: categoryColors['Delivery Delay'],
        backgroundColor: categoryColors['Delivery Delay'],
        tension: 0.4
      },
      {
        label: 'Refund Request',
        data: [20, 22, 18, 25, 20, 28],
        borderColor: categoryColors['Refund Request'],
        backgroundColor: categoryColors['Refund Request'],
        tension: 0.4
      },
      {
        label: 'Product Complaint',
        data: [13, 15, 18, 14, 16, 22],
        borderColor: categoryColors['Product Complaint'],
        backgroundColor: categoryColors['Product Complaint'],
        tension: 0.4
      }
    ]
  };

  const lineLegendItems = lineData.datasets.map(ds => ({
    label: ds.label,
    color: ds.borderColor
  }));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  const barOptions = {
    ...chartOptions,
    indexAxis: 'y',
    scales: {
      x: { grid: { color: '#1E2D4A' }, ticks: { color: '#6B7FA3' } },
      y: { grid: { display: false }, ticks: { color: '#6B7FA3' } }
    }
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      x: { grid: { color: '#1E2D4A' }, ticks: { color: '#6B7FA3' } },
      y: { grid: { color: '#1E2D4A' }, ticks: { color: '#6B7FA3' } }
    }
  };

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Queries" value={totalQueries} />
        <MetricCard title="Auto-Resolvable %" value="73%" subtitle="Stable" />
        <MetricCard title="Avg AI Response Time" value="1.8m" subtitle="< 2 min" />
        <MetricCard title="Top Issue" value={topIssue.name} subtitle={`${topIssue.pct}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Issue Distribution</h2>
          <div className="h-[300px]">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
          <CustomLegend items={legendItems} />
        </div>
        <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Query Volume by Category</h2>
          <div className="h-[300px]">
            <Bar data={barData} options={barOptions} />
          </div>
          <CustomLegend items={legendItems} />
        </div>
      </div>

      <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-8">Query Volume Heatmap — Last 7 Days</h2>
        <div className="flex border border-[#1E2D4A] p-6 rounded-lg bg-[#0B0F1A] overflow-x-auto">
          <div className="flex flex-col gap-[3px] mr-4 text-xs text-[#6B7FA3] font-medium mt-[2px]">
             {dayLabels.map(day => <div key={day} className="h-[18px] flex items-center">{day}</div>)}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-[3px]">
              {heatmapData.map((row, dIdx) => (
                <div key={dIdx} className="flex gap-[3px]">
                  {row.map((val, hIdx) => (
                    <div 
                      key={`${dIdx}-${hIdx}`}
                      title={`${dayLabels[dIdx]} ${hIdx}:00 - ${val} queries`}
                      className="w-[18px] h-[18px] rounded-[3px] hover:ring-1 hover:ring-white transition-all cursor-pointer"
                      style={{ backgroundColor: getHeatmapColor(val) }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[#6B7FA3] px-1 font-['Space_Mono'] mt-1">
              <span>0</span><span>6</span><span>12</span><span>18</span><span>23</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-6 justify-end text-xs text-[#6B7FA3]">
          <span>None</span>
          <div className="w-3 h-3 rounded-sm bg-[#0B0F1A] border border-[#1E2D4A]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#0D2A2A]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#0F4040]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#0A7A6A]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#00C9A7]"></div>
          <span>Peak</span>
        </div>
      </div>

      <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Weekly Support Trends</h2>
        <div className="h-[350px]">
          <Line data={lineData} options={lineOptions} />
        </div>
        <CustomLegend items={lineLegendItems} />
      </div>

      <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl overflow-hidden">
        <div className="bg-[#1E2D4A]/30 p-5 border-b border-[#1E2D4A]">
           <h2 className="text-xl font-semibold text-[#DDE6F4]">SLA & Time Savings Tracker</h2>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="flex items-center justify-between col-span-1 border border-[#1E2D4A] rounded-xl p-5 bg-[#0B0F1A]">
            <div className="flex flex-col items-center">
              <span className="text-xs text-[#6B7FA3] font-bold uppercase tracking-wider mb-2">Without AI</span>
              <span className="text-[#DDE6F4] text-xl font-bold font-['Space_Mono']">{manualTimeStr}</span>
              <span className="text-xs text-[#6B7FA3] mt-1">@ 4.2 hrs/ticket</span>
            </div>
            
            <div className="flex flex-col items-center justify-center px-4">
               <span className="text-[10px] font-bold text-[#00C9A7] uppercase tracking-widest bg-[#00C9A7]/10 px-2 py-1 rounded-full mb-1">Time Saved</span>
               <span className="text-sm font-bold text-[#00C9A7]">{savedTimeStr}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-[#00C9A7] font-bold uppercase tracking-wider mb-2">With Your System</span>
              <span className="text-[#DDE6F4] text-xl font-bold font-['Space_Mono']">{aiTimeStr}</span>
              <span className="text-xs text-[#6B7FA3] mt-1">&lt; 2 min/ticket</span>
            </div>
          </div>

          <div className="col-span-1 flex flex-col justify-center space-y-4 border border-[#1E2D4A] rounded-xl p-5 bg-[#0B0F1A]">
            <h3 className="text-xs text-[#6B7FA3] font-bold uppercase tracking-wider mb-1">SLA Breach Risk Meter</h3>
            {['Order Tracking', 'Delivery Delay', 'Refund Request', 'Payment Failure'].map(cat => {
              const riskInfo = getSlaRisk(cat);
              return (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#DDE6F4]">{cat} <span className="text-xs text-[#6B7FA3] ml-1">(SLA: {slaTargets[cat]}h)</span></span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${riskInfo.textColor} bg-opacity-10 border border-current`}>{riskInfo.status}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1E2D4A] rounded-full overflow-hidden">
                    <div className={`h-full ${riskInfo.color}`} style={{ width: `${riskInfo.risk}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-span-1 grid grid-cols-2 gap-3">
             <div className="bg-[#0B0F1A] border border-[#1E2D4A] p-4 rounded-lg flex flex-col justify-center">
               <span className="text-[10px] text-[#6B7FA3] font-bold uppercase tracking-widest mb-1">Auto-Resolved</span>
               <span className="text-2xl font-bold text-[#DDE6F4] font-['Space_Mono']">{autoResolved}</span>
             </div>
             <div className="bg-[#0B0F1A] border border-[#1E2D4A] p-4 rounded-lg flex flex-col justify-center">
               <span className="text-[10px] text-[#6B7FA3] font-bold uppercase tracking-widest mb-1">Agent Hrs Saved</span>
               <span className="text-2xl font-bold text-[#00C9A7] font-['Space_Mono']">{agentHoursSaved}</span>
             </div>
             <div className="bg-[#0B0F1A] border border-[#1E2D4A] p-4 rounded-lg flex flex-col justify-center">
               <span className="text-[10px] text-[#6B7FA3] font-bold uppercase tracking-widest mb-1">Cost Saved</span>
               <span className="text-2xl font-bold text-[#DDE6F4] font-['Space_Mono']">Rs. {costSaved}</span>
             </div>
             <div className="bg-[#0B0F1A] border border-[#1E2D4A] p-4 rounded-lg flex flex-col justify-center">
               <span className="text-[10px] text-[#6B7FA3] font-bold uppercase tracking-widest mb-1">CSAT Lift</span>
               <span className="text-2xl font-bold text-[#00C9A7] font-['Space_Mono']">+34%</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
