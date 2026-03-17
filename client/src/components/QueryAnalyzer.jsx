import React, { useState } from 'react';
import { useQueries } from '../hooks/useQueries';
import { classifyQuery } from '../services/classifier';
import CategoryBadge from './CategoryBadge';

const automationPotentialMap = {
  'Order Tracking': 88,
  'General Query': 92,
  'Payment Failure': 72,
  'Delivery Delay': 62,
  'Subscription Issue': 68,
  'Refund Request': 45,
  'Product Complaint': 38
};

const sampleInputs = [
  "Order #BL4521 not received for 7 days",
  "Wrong item received, need full refund",
  "Payment debited but order not placed",
  "Beast Whey tastes completely different"
];

const QueryAnalyzer = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const { addQuery } = useQueries();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await classifyQuery(text);
      
      const newQuery = {
        id: Date.now().toString(),
        text,
        source: 'Web Test',
        timeAgo: 'Just now',
        ...data
      };
      
      addQuery(newQuery);
      setResult(newQuery);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#DDE6F4]">Simulate Customer Query</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {sampleInputs.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setText(sample)}
              className="px-3 py-1.5 bg-[#1E2D4A]/50 hover:bg-[#1E2D4A] border border-[#1E2D4A] rounded-md text-sm text-[#6B7FA3] hover:text-[#DDE6F4] transition-colors text-left"
            >
              "{sample}"
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type a customer message here..."
          className="w-full h-32 bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg p-4 text-[#DDE6F4] placeholder-[#6B7FA3] focus:outline-none focus:border-[#00C9A7] transition-colors resize-none mb-4 font-['Space_Mono']"
        ></textarea>

        <div className="flex justify-end gap-4 items-center">
          {error && <span className="text-red-400 text-sm">{error}</span>}
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="px-6 py-3 bg-[#00C9A7] hover:bg-[#00C9A7]/90 text-[#0B0F1A] font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0B0F1A] border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              'Analyze with AI'
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#141928] border border-[#00C9A7]/30 rounded-xl p-6 shadow-[0_0_15px_rgba(0,201,167,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold text-[#00C9A7] mb-6 flex items-center gap-2">
            <span className="text-xl">✨</span> AI Analysis Complete
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-[#6B7FA3] uppercase tracking-wider mb-2">Category</p>
              <CategoryBadge category={result.category} />
            </div>
            <div>
              <p className="text-xs text-[#6B7FA3] uppercase tracking-wider mb-2">Confidence</p>
              <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${result.confidence === 'high' ? 'bg-[#00C9A7]/10 text-[#00C9A7]' : result.confidence === 'medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                {result.confidence}
              </span>
            </div>
            <div>
              <p className="text-xs text-[#6B7FA3] uppercase tracking-wider mb-2">Sentiment</p>
              <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold capitalize tracking-wide ${result.sentiment === 'angry' ? 'bg-red-500/10 text-red-400' : result.sentiment === 'frustrated' ? 'bg-orange-500/10 text-orange-400' : result.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                {result.sentiment}
              </span>
            </div>
            <div>
              <p className="text-xs text-[#6B7FA3] uppercase tracking-wider mb-2">Priority</p>
              <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${result.priority === 'urgent' ? 'bg-red-500/10 text-red-500' : result.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {result.priority}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-[#6B7FA3] uppercase tracking-wider mb-2 flex justify-between items-center">
                Executive Summary
              </p>
              <p className="text-lg text-[#DDE6F4] font-medium leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[#6B7FA3] uppercase tracking-wider font-bold">Suggested AI Reply</p>
                  <button className="text-xs text-[#00C9A7] hover:underline">Copy</button>
                </div>
                <p className="text-[#DDE6F4] text-sm leading-relaxed whitespace-pre-wrap font-['Space_Mono']">
                  {result.suggestedResponse}
                </p>
              </div>

              <div className="bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[#6B7FA3] uppercase tracking-wider font-bold">Recommended System Action</p>
                  <span className="text-xs font-bold text-[#00C9A7] px-2 py-0.5 bg-[#00C9A7]/10 rounded">
                    {automationPotentialMap[result.category] || 50}% Auto-Resolvable
                  </span>
                </div>
                <p className="text-[#DDE6F4] text-sm leading-relaxed font-['Space_Mono']">
                  {result.automationAction}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryAnalyzer;
