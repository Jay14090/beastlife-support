import React, { useState, useEffect } from 'react';
import { useQueries } from '../hooks/useQueries';
import CategoryBadge from './CategoryBadge';

const defaultCategories = [
  'Order Tracking', 'Delivery Delay', 'Refund Request', 
  'Product Complaint', 'General Query', 'Payment Failure', 'Subscription Issue'
];

const sources = ['WhatsApp', 'Instagram', 'Email'];
const priorities = ['Urgent', 'High', 'Normal', 'Low'];

const getRelativeTime = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const QueryFeed = () => {
  const { queries } = useQueries();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [srcFilter, setSrcFilter] = useState('All');
  const [prioFilter, setPrioFilter] = useState('All');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleExportCSV = () => {
    const headers = 'ID,Message,Category,Source,Sentiment,Priority,Timestamp\n';
    const rows = queries.map(q => {
      const escapedText = q.text.replace(/"/g, '""');
      return `"${q.id}","${escapedText}","${q.category}","${q.source}","${q.sentiment}","${q.priority}","${q.createdAt || q.timeAgo}"`;
    }).join('\n');
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `beastlife-queries-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearch('');
    setCatFilter('All');
    setSrcFilter('All');
    setPrioFilter('All');
  };

  const filteredQueries = queries.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || q.category === catFilter;
    const matchSrc = srcFilter === 'All' || q.source === srcFilter;
    const matchPrio = prioFilter === 'All' || q.priority.toLowerCase() === prioFilter.toLowerCase();
    return matchSearch && matchCat && matchSrc && matchPrio;
  });

  const getCatCount = (cat) => queries.filter(q => 
    (cat === 'All' || q.category === cat) &&
    (srcFilter === 'All' || q.source === srcFilter) &&
    (prioFilter === 'All' || q.priority.toLowerCase() === prioFilter.toLowerCase()) &&
    q.text.toLowerCase().includes(search.toLowerCase())
  ).length;

  const getSrcCount = (src) => queries.filter(q => 
    (catFilter === 'All' || q.category === catFilter) &&
    (src === 'All' || q.source === src) &&
    (prioFilter === 'All' || q.priority.toLowerCase() === prioFilter.toLowerCase()) &&
    q.text.toLowerCase().includes(search.toLowerCase())
  ).length;

  const getPrioCount = (prio) => queries.filter(q => 
    (catFilter === 'All' || q.category === catFilter) &&
    (srcFilter === 'All' || q.source === srcFilter) &&
    (prio === 'All' || q.priority.toLowerCase() === prio.toLowerCase()) &&
    q.text.toLowerCase().includes(search.toLowerCase())
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-[#141928] p-4 rounded-xl border border-[#1E2D4A]">
        <input
          type="text"
          placeholder="Search customer messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg px-4 py-2 w-96 text-[#DDE6F4] placeholder-[#6B7FA3] focus:outline-none focus:border-[#00C9A7]"
        />
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#6B7FA3]">Showing {filteredQueries.length} of {queries.length} queries</span>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E2D4A] hover:bg-[#1E2D4A]/80 text-[#DDE6F4] text-sm font-medium rounded-lg border border-[#6B7FA3]/30 transition-colors"
          >
            <span>⬇</span> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-[#DDE6F4] uppercase tracking-wider">Filters</h3>
          <button onClick={clearFilters} className="text-xs text-[#00C9A7] hover:underline">Clear All</button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="text-xs text-[#6B7FA3] font-medium w-16 shrink-0">Category</span>
            {['All', ...defaultCategories].map(cat => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${catFilter === cat ? 'bg-[#00C9A7] text-[#0B0F1A] border-[#00C9A7]' : 'bg-[#0B0F1A] text-[#DDE6F4] border-[#1E2D4A] hover:border-[#6B7FA3]/50'}`}
              >
                {cat} <span className="opacity-70 ml-1">({getCatCount(cat)})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="text-xs text-[#6B7FA3] font-medium w-16 shrink-0">Source</span>
            {['All', ...sources].map(src => (
              <button
                key={src}
                onClick={() => setSrcFilter(src)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${srcFilter === src ? 'bg-[#3B82F6] text-[#ffffff] border-[#3B82F6]' : 'bg-[#0B0F1A] text-[#DDE6F4] border-[#1E2D4A] hover:border-[#6B7FA3]/50'}`}
              >
                {src} <span className="opacity-70 ml-1">({getSrcCount(src)})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="text-xs text-[#6B7FA3] font-medium w-16 shrink-0">Priority</span>
            {['All', ...priorities].map(prio => (
              <button
                key={prio}
                onClick={() => setPrioFilter(prio)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${prioFilter === prio ? 'bg-[#F59E0B] text-[#0B0F1A] border-[#F59E0B]' : 'bg-[#0B0F1A] text-[#DDE6F4] border-[#1E2D4A] hover:border-[#6B7FA3]/50'}`}
              >
                {prio} <span className="opacity-70 ml-1">({getPrioCount(prio)})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl overflow-hidden min-h-[400px]">
        {filteredQueries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#6B7FA3]">
            <span className="text-4xl mb-4">📭</span>
            <p className="text-lg font-medium">No queries match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1E2D4A]">
            {filteredQueries.map(q => (
              <div key={q.id} className="p-5 hover:bg-[#1E2D4A]/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <p className="text-[#DDE6F4] text-lg font-medium">{q.text}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <CategoryBadge category={q.category} />
                      <span className="text-xs text-[#6B7FA3] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7FA3]"></span>
                        {q.source}
                      </span>
                      <span className="text-xs text-[#6B7FA3] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7FA3]"></span>
                        {q.createdAt ? getRelativeTime(q.createdAt) : q.timeAgo}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded tracking-widest uppercase font-bold shrink-0 ${q.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : q.priority === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {q.priority}
                    </span>
                    <span className={`text-xs capitalize font-medium shrink-0 ${q.sentiment === 'angry' ? 'text-red-400' : q.sentiment === 'frustrated' ? 'text-orange-400' : q.sentiment === 'positive' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {q.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryFeed;
