import React, { useState, useEffect } from 'react';
import { useQueries } from '../hooks/useQueries';

const SmartAlertFeed = () => {
  const { queries } = useQueries();
  const [isOpen, setIsOpen] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [lastQueryId, setLastQueryId] = useState(null);

  useEffect(() => {
    // Initial mock alerts
    const initialAlerts = [
      { id: 'a1', type: 'critical', title: 'Payment Spikes', message: 'Urgent payment failure spike detected (3 new in last 10 min)', time: '2m ago', read: false },
      { id: 'a2', type: 'warning', title: 'Delivery Trend', message: 'Delivery delay queries up 40% this week', time: '1h ago', read: false },
      { id: 'a3', type: 'warning', title: 'Product Flag', message: '2 product complaints flagged as potential spoilage', time: '3h ago', read: false },
      { id: 'a4', type: 'critical', title: 'SLA Risk', message: 'SLA breach risk Critical for Payment Failure category', time: '5h ago', read: false },
      { id: 'a5', type: 'info', title: 'Automation Win', message: '14 queries auto-resolved in last session', time: '1d ago', read: false }
    ];
    setAlerts(initialAlerts);
  }, []);

  useEffect(() => {
    // Inject new alert on new query
    if (queries.length > 0) {
      const topQuery = queries[0];
      if (lastQueryId && topQuery.id !== lastQueryId) {
        let type = 'info';
        if (topQuery.priority === 'urgent' || topQuery.priority === 'high') {
          type = 'critical';
        } else if (topQuery.sentiment === 'angry' || topQuery.sentiment === 'frustrated') {
          type = 'warning';
        }
        
        const newAlert = {
          id: `a-${Date.now()}`,
          type,
          title: `New ${topQuery.category}`,
          message: topQuery.text,
          time: 'Just now',
          read: false
        };
        setAlerts(prev => [newAlert, ...prev]);
        setIsOpen(true);
      }
      setLastQueryId(topQuery.id);
    }
  }, [queries, lastQueryId]);

  const unreadCount = alerts.filter(a => !a.read).length;

  const markRead = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const clearAll = (e) => {
    e.stopPropagation();
    setAlerts([]);
  };

  const getAlertStyles = (type, read) => {
    const base = 'p-3 border-l-4 rounded-r flex gap-3 cursor-pointer transition-all ';
    const opacity = read ? 'opacity-50 hover:opacity-100 bg-[#0B0F1A]' : 'bg-[#1E2D4A]/50 hover:bg-[#1E2D4A]';
    
    if (type === 'critical') return base + opacity + ' border-red-500';
    if (type === 'warning') return base + opacity + ' border-orange-500';
    return base + opacity + ' border-[#00C9A7]';
  };

  const getIcon = (type) => {
    if (type === 'critical') return <span className="text-red-500 mt-0.5">⚠️</span>;
    if (type === 'warning') return <span className="text-orange-500 mt-0.5">⚡</span>;
    return <span className="text-[#00C9A7] mt-0.5">💡</span>;
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-[#141928] border border-[#1E2D4A] rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col transition-all duration-300">
      <div 
        className="flex justify-between items-center p-3 bg-[#0B0F1A] border-b border-[#1E2D4A] cursor-pointer hover:bg-[#1E2D4A]/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#DDE6F4]">🔔 Smart Alerts</span>
          {unreadCount > 0 && (
            <span className="bg-[#00C9A7] text-[#0B0F1A] text-xs font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isOpen && <button onClick={clearAll} className="text-xs text-[#6B7FA3] hover:text-[#DDE6F4]">Clear</button>}
          <span className="text-[#6B7FA3] text-sm">{isOpen ? '▼' : '▲'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-2 custom-scrollbar">
          {alerts.map(alert => (
            <div key={alert.id} className={getAlertStyles(alert.type, alert.read)} onClick={() => markRead(alert.id)}>
              <div className="shrink-0">{getIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className={`text-sm font-semibold truncate ${alert.type === 'critical' ? 'text-red-400' : alert.type === 'warning' ? 'text-orange-400' : 'text-[#00C9A7]'}`}>
                    {alert.title}
                  </h4>
                  <span className="text-[10px] text-[#6B7FA3] whitespace-nowrap ml-2">{alert.time}</span>
                </div>
                <p className="text-xs text-[#DDE6F4] line-clamp-2 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartAlertFeed;
