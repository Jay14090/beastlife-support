import React from 'react';

const automationStrategies = [
  {
    category: 'Order Tracking',
    icon: '📦',
    tool: 'Zapier + Shiprocket API',
    auto: '88%',
    action: 'Auto-fetch tracking status using order ID extracted from message. Return real-time delivery update with tracking link.',
    template: 'Hi {name}! Order #{id} status: {status}. Track here: {link}. Estimated arrival: {date}',
    effort: 'Low',
    impact: 'High'
  },
  {
    category: 'Delivery Delay',
    icon: '⏳',
    tool: 'n8n + Logistics Webhook',
    auto: '62%',
    action: 'Monitor delivery SLA breach. Trigger apology flow with updated ETA and auto-apply store credit to customer account.',
    template: 'Sorry for the delay on #{id}. New ETA: {date}. Rs.50 credit added to your account.',
    effort: 'Medium',
    impact: 'High'
  },
  {
    category: 'Refund Request',
    icon: '💸',
    tool: 'LangChain + Razorpay API',
    auto: '45%',
    action: 'Check order eligibility for return policy. Auto-initiate refund for qualifying orders. Flag edge cases for human review.',
    template: 'Refund initiated for #{id}. Will reflect in 5-7 business days to {payment_method}.',
    effort: 'High',
    impact: 'Medium'
  },
  {
    category: 'Product Complaint',
    icon: '⚠️',
    tool: 'OpenAI API + Freshdesk',
    auto: '38%',
    action: 'Classify complaint severity. Auto-log to quality control system. Immediately escalate damage or spoilage reports to senior agent.',
    template: 'Complaint #CMP{id} logged. Our QC team will contact you within 24 hours.',
    effort: 'Medium',
    impact: 'High'
  },
  {
    category: 'General Query',
    icon: '💬',
    tool: 'OpenAI Embeddings + Pinecone RAG',
    auto: '92%',
    action: 'Semantic search through product FAQ and catalog using vector embeddings. Answer instantly. Escalate only truly novel queries.',
    template: '{faq_answer} — Need more help? Type AGENT to reach our support team.',
    effort: 'High',
    impact: 'High'
  },
  {
    category: 'Payment Failure',
    icon: '💳',
    tool: 'Razorpay Webhooks + n8n',
    auto: '72%',
    action: 'Auto-detect failed transaction. Verify if amount was actually debited. Send secure retry link or initiate immediate refund for duplicate charges.',
    template: 'No amount was deducted for order #{id}. Retry payment here: {link}',
    effort: 'Low',
    impact: 'High'
  },
  {
    category: 'Subscription Issue',
    icon: '🔁',
    tool: 'Chargebee API + Chatbot',
    auto: '68%',
    action: 'Connect to subscription management API. Handle pause, cancel, and plan change requests through an automated guided chatbot flow.',
    template: 'Manage your subscription anytime at {portal_link}. Reply HELP for step-by-step guidance.',
    effort: 'High',
    impact: 'Medium'
  }
];

const ArchitectureFlow = () => (
  <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-8 mb-8 overflow-x-auto">
    <h3 className="text-[#DDE6F4] font-semibold text-lg mb-8 uppercase tracking-wider text-center">Zero-Touch Resolution Flow</h3>
    <div className="flex items-center justify-between min-w-[900px]">
      <div className="flex flex-col items-center flex-1">
        <div className="w-16 h-16 rounded-2xl bg-[#1E2D4A] border border-[#6B7FA3]/30 flex items-center justify-center text-3xl mb-3 shadow-lg">📱</div>
        <div className="text-[#DDE6F4] font-bold text-sm">Channels</div>
        <div className="text-[#6B7FA3] text-xs mt-1 text-center">WhatsApp, IG, Email</div>
      </div>
      
      <div className="text-[#00C9A7] text-2xl px-2">➔</div>
      
      <div className="flex flex-col items-center flex-1">
        <div className="w-16 h-16 rounded-2xl bg-[#1E2D4A] border border-[#6B7FA3]/30 flex items-center justify-center text-3xl mb-3 shadow-lg">⚡</div>
        <div className="text-[#DDE6F4] font-bold text-sm">Webhook Trigger</div>
        <div className="text-[#6B7FA3] text-xs mt-1 text-center">n8n / Zapier</div>
      </div>

      <div className="text-[#00C9A7] text-2xl px-2">➔</div>
      
      <div className="flex flex-col items-center flex-1">
        <div className="w-16 h-16 rounded-2xl bg-[#00C9A7]/20 border border-[#00C9A7]/50 flex items-center justify-center text-3xl mb-3 shadow-[0_0_15px_rgba(0,201,167,0.2)]">🧠</div>
        <div className="text-[#00C9A7] font-bold text-sm">AI Engine</div>
        <div className="text-[#00C9A7]/70 text-xs mt-1 text-center">OpenAI API</div>
      </div>

      <div className="text-[#00C9A7] text-2xl px-2">➔</div>
      
      <div className="flex flex-col items-center flex-1">
        <div className="w-16 h-16 rounded-2xl bg-[#1E2D4A] border border-[#6B7FA3]/30 flex items-center justify-center text-3xl mb-3 shadow-lg">⚙️</div>
        <div className="text-[#DDE6F4] font-bold text-sm">Automation Layer</div>
        <div className="text-[#6B7FA3] text-xs mt-1 text-center">API Actions</div>
      </div>

      <div className="text-[#00C9A7] text-2xl px-2">➔</div>
      
      <div className="flex flex-col items-center flex-1">
        <div className="w-16 h-16 rounded-2xl bg-[#1E2D4A] border border-[#6B7FA3]/30 flex items-center justify-center text-3xl mb-3 shadow-lg">📊</div>
        <div className="text-[#DDE6F4] font-bold text-sm">Dashboard</div>
        <div className="text-[#6B7FA3] text-xs mt-1 text-center">Real-time Insights</div>
      </div>
    </div>
  </div>
);

const AutomationPlaybook = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ArchitectureFlow />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automationStrategies.map((strategy, idx) => (
          <div key={idx} className="bg-[#141928] border border-[#1E2D4A] rounded-xl overflow-hidden flex flex-col hover:border-[#6B7FA3]/50 transition-colors">
            <div className="p-6 border-b border-[#1E2D4A] flex justify-between items-start bg-[#141928]/50">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-[#0B0F1A] p-3 rounded-lg border border-[#1E2D4A]">{strategy.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#DDE6F4]">{strategy.category}</h3>
                  <div className="text-sm font-medium text-[#6B7FA3] mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]"></span>
                    {strategy.tool}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#00C9A7] text-3xl font-bold font-['Space_Mono'] tracking-tighter">{strategy.auto}</span>
                <span className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold">Auto-Potential</span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-6 flex-1">
                <p className="text-sm text-[#DDE6F4] leading-relaxed mb-4">{strategy.action}</p>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wide bg-[#1E2D4A] text-[#DDE6F4]`}>
                    Effort: {strategy.effort}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wide bg-[#00C9A7]/10 text-[#00C9A7]`}>
                    Impact: {strategy.impact}
                  </span>
                </div>
              </div>
              
              <div className="bg-[#0B0F1A] rounded-lg border border-[#1E2D4A] p-4">
                <p className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-2">Response Template</p>
                <code className="text-[#00C9A7] text-sm font-['Space_Mono'] block whitespace-pre-wrap leading-relaxed">
                  {strategy.template}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationPlaybook;
