import React, { useState } from 'react';
import { useQueries } from '../hooks/useQueries';

const integrations = [
  { name: 'WhatsApp Business API', icon: '💬', bg: '#25D36620', color: '#25D366', desc: 'Receives incoming DMs and sends automated replies', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Instagram Graph API', icon: '📸', bg: '#E134AB20', color: '#E134AB', desc: 'Monitors DMs and comment mentions in real time', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Gmail API', icon: '📧', bg: '#EA433520', color: '#EA4335', desc: 'Ingests support emails and triggers classification', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'n8n Workflow Engine', icon: '⚙️', bg: '#FF640220', color: '#FF6402', desc: 'Orchestrates all automation flows between platforms', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Zapier', icon: '⚡', bg: '#FF4A0020', color: '#FF4A00', desc: 'Handles simple trigger-action automation chains', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'OpenAI API', icon: '🧠', bg: '#10A37F20', color: '#10A37F', desc: 'Powers query classification and auto-reply generation', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Razorpay', icon: '💳', bg: '#3395FF20', color: '#3395FF', desc: 'Handles refund initiation and payment failure detection', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Shiprocket API', icon: '📦', bg: '#FF6B3520', color: '#FF6B35', desc: 'Fetches live order tracking data by order ID', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Freshdesk', icon: '🎫', bg: '#25C16F20', color: '#25C16F', desc: 'Receives escalated tickets with pre-filled AI summary', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Pinecone', icon: '🗄️', bg: '#1C40A620', color: '#1C40A6', desc: 'Vector database for semantic FAQ search and RAG', status: 'Active', badge: 'bg-[#00C9A7]' },
  { name: 'Chargebee', icon: '🔄', bg: '#F5704520', color: '#F57045', desc: 'Manages subscription pause, cancel, and plan changes', status: 'Connected', badge: 'bg-[#25D366]' },
  { name: 'Twilio', icon: '📱', bg: '#F2261420', color: '#F22614', desc: 'Backup SMS channel for urgent customer escalations', status: 'Standby', badge: 'bg-[#F22614]' },
];

const scenarios = {
  "Order Tracking Query": {
    steps: [
      { num: 1, title: 'Webhook Received', desc: 'WhatsApp DM triggers n8n webhook', badge: 'n8n', ms: 12, color: '#FF6402' },
      { num: 2, title: 'Text Extraction', desc: 'Order ID extracted using regex pattern /BL\\d{4}/', badge: 'n8n', ms: 8, color: '#FF6402' },
      { num: 3, title: 'AI Classification', desc: 'Message classified as Order Tracking with 94% confidence', badge: 'OpenAI', ms: 340, color: '#10A37F' },
      { num: 4, title: 'Shiprocket API Call', desc: 'GET /orders/{id}/tracking called with extracted order ID', badge: 'Shiprocket', ms: 180, color: '#FF6B35' },
      { num: 5, title: 'Response Generation', desc: 'Tracking data merged into reply template', badge: 'n8n', ms: 22, color: '#FF6402' },
      { num: 6, title: 'Auto-Reply Sent', desc: 'Message delivered via WhatsApp Business API', badge: 'WhatsApp API', ms: 95, color: '#25D366' },
      { num: 7, title: 'Dashboard Updated', desc: 'Query logged to analytics store with category and timestamp', badge: 'Internal', ms: 15, color: '#3395FF' },
    ],
    totalTime: '672ms', platforms: 4, humanNeeded: 'No'
  },
  "Delivery Delay Alert": {
    steps: [
      { num: 1, title: 'Webhook Received', desc: 'Logistics SLA breach triggers n8n webhook', badge: 'n8n', ms: 14, color: '#FF6402' },
      { num: 2, title: 'ETA Calculation', desc: 'New delivery date calculated', badge: 'n8n', ms: 11, color: '#FF6402' },
      { num: 3, title: 'Credit Assignment', desc: 'Store credit API called to compensate user', badge: 'Internal', ms: 45, color: '#3395FF' },
      { num: 4, title: 'Message Generation', desc: 'Apology template formatted with new ETA', badge: 'n8n', ms: 18, color: '#FF6402' },
      { num: 5, title: 'Alert Sent', desc: 'Proactive message sent via WhatsApp API', badge: 'WhatsApp API', ms: 110, color: '#25D366' },
      { num: 6, title: 'Dashboard Updated', desc: 'Incident logged to dashboard feed', badge: 'Internal', ms: 12, color: '#3395FF' },
    ],
    totalTime: '210ms', platforms: 3, humanNeeded: 'No'
  },
  "Refund Request": {
    steps: [
      { num: 1, title: 'Instagram DM Detected', desc: 'Graph API webhook fires on new DM', badge: 'Instagram API', ms: 15, color: '#E134AB' },
      { num: 2, title: 'AI Classification', desc: 'Classified as Refund Request, sentiment: frustrated', badge: 'OpenAI', ms: 290, color: '#10A37F' },
      { num: 3, title: 'Order Eligibility Check', desc: 'Order date and return policy checked against database', badge: 'Internal', ms: 45, color: '#3395FF' },
      { num: 4, title: 'Eligibility Confirmed', desc: 'Order within 7-day return window — auto-approve', badge: 'Internal', ms: 8, color: '#3395FF' },
      { num: 5, title: 'Razorpay Refund Initiated', desc: 'POST /refunds called with order amount', badge: 'Razorpay', ms: 310, color: '#3395FF' },
      { num: 6, title: 'Confirmation Sent', desc: 'Refund confirmation DM sent via Instagram API', badge: 'Instagram API', ms: 92, color: '#E134AB' },
      { num: 7, title: 'Freshdesk Ticket Created', desc: 'Pre-filled ticket created for QC record', badge: 'Freshdesk', ms: 130, color: '#25C16F' },
      { num: 8, title: 'Dashboard Updated', desc: 'Logged as auto-resolved refund', badge: 'Internal', ms: 12, color: '#3395FF' },
    ],
    totalTime: '902ms', platforms: 5, humanNeeded: 'No'
  },
  "Product Complaint": {
    steps: [
      { num: 1, title: 'Email Trigger', desc: 'Gmail API detects new email complaint', badge: 'Gmail API', ms: 18, color: '#EA4335' },
      { num: 2, title: 'AI Classification', desc: 'Classified as Product Complaint, severity: High', badge: 'OpenAI', ms: 320, color: '#10A37F' },
      { num: 3, title: 'Intent Detected', desc: 'Complaint involves product damage, human required', badge: 'OpenAI', ms: 45, color: '#10A37F' },
      { num: 4, title: 'Ticket Escalation', desc: 'High-priority ticket created with AI summary', badge: 'Freshdesk', ms: 145, color: '#25C16F' },
      { num: 5, title: 'Acknowledgement Sent', desc: 'Auto-reply sent setting 24h SLA expectation', badge: 'Gmail API', ms: 85, color: '#EA4335' },
      { num: 6, title: 'Dashboard Updated', desc: 'Logged as Escalated Status', badge: 'Internal', ms: 14, color: '#3395FF' },
    ],
    totalTime: '627ms', platforms: 3, humanNeeded: 'Yes'
  },
  "Payment Failure": {
    steps: [
      { num: 1, title: 'Email Trigger', desc: 'Gmail API detects new email with subject containing payment', badge: 'Gmail API', ms: 18, color: '#EA4335' },
      { num: 2, title: 'AI Classification', desc: 'Classified as Payment Failure, priority set to Urgent', badge: 'OpenAI', ms: 310, color: '#10A37F' },
      { num: 3, title: 'Razorpay Webhook Check', desc: 'Cross-reference transaction ID for debit confirmation', badge: 'Razorpay', ms: 220, color: '#3395FF' },
      { num: 4, title: 'Debit Status', desc: 'No deduction confirmed — retry flow initiated', badge: 'Razorpay', ms: 95, color: '#3395FF' },
      { num: 5, title: 'Secure Retry Link Generated', desc: 'One-time payment retry URL created', badge: 'Razorpay', ms: 140, color: '#3395FF' },
      { num: 6, title: 'Auto-Reply Sent', desc: 'Email sent with retry link and reassurance message', badge: 'Gmail API', ms: 88, color: '#EA4335' },
      { num: 7, title: 'Alert Triggered', desc: 'Critical alert pushed to dashboard notification feed', badge: 'Internal', ms: 10, color: '#3395FF' },
      { num: 8, title: 'Dashboard Updated', desc: 'Logged with Urgent priority flag', badge: 'Internal', ms: 12, color: '#3395FF' },
    ],
    totalTime: '893ms', platforms: 3, humanNeeded: 'No'
  },
  "Subscription Cancellation": {
    steps: [
      { num: 1, title: 'Webhook Received', desc: 'WhatsApp DM triggers webhook', badge: 'WhatsApp API', ms: 16, color: '#25D366' },
      { num: 2, title: 'AI Classification', desc: 'Classified as Subscription Cancellation request', badge: 'OpenAI', ms: 280, color: '#10A37F' },
      { num: 3, title: 'Account Lookup', desc: 'Chargebee API called to get active subscription status', badge: 'Chargebee', ms: 155, color: '#F57045' },
      { num: 4, title: 'Pause Offer Check', desc: 'AI evaluates if pause offer was previously made', badge: 'OpenAI', ms: 60, color: '#10A37F' },
      { num: 5, title: 'Cancellation API Call', desc: 'POST /subscriptions/{id}/cancel called', badge: 'Chargebee', ms: 210, color: '#F57045' },
      { num: 6, title: 'Confirmation Sent', desc: 'Message sent confirming end of billing cycle', badge: 'WhatsApp API', ms: 90, color: '#25D366' },
      { num: 7, title: 'Dashboard Updated', desc: 'Churn metric updated in analytics', badge: 'Internal', ms: 15, color: '#3395FF' },
    ],
    totalTime: '826ms', platforms: 4, humanNeeded: 'No'
  },
  "General FAQ Query": {
    steps: [
      { num: 1, title: 'Webhook Received', desc: 'Instagram DM triggers webhook', badge: 'Instagram API', ms: 14, color: '#E134AB' },
      { num: 2, title: 'AI Classification', desc: 'Classified as General FAQ Query', badge: 'OpenAI', ms: 180, color: '#10A37F' },
      { num: 3, title: 'Vector Search', desc: 'Query embedded and searched against knowledge base', badge: 'Pinecone', ms: 95, color: '#1C40A6' },
      { num: 4, title: 'AI Response Generation', desc: 'RAG response generated from top 3 Pinecone results', badge: 'OpenAI', ms: 380, color: '#10A37F' },
      { num: 5, title: 'Auto-Reply Sent', desc: 'Generated response sent to customer', badge: 'Instagram API', ms: 85, color: '#E134AB' },
      { num: 6, title: 'Dashboard Updated', desc: 'Query logged as handled by RAG', badge: 'Internal', ms: 10, color: '#3395FF' },
    ],
    totalTime: '764ms', platforms: 3, humanNeeded: 'No'
  }
};

const playbooks = [
  {
    category: 'Order Tracking', emoji: '📦', pct: '88%', color: '#FF6B35',
    badges: ['Zapier', 'Shiprocket', 'WhatsApp'],
    trigger: 'New WhatsApp message containing order number pattern (e.g., BL1234)',
    condition: 'AI confidence > 75% AND category = Order Tracking',
    code: `GET https://apiv2.shiprocket.in/v1/external/orders/show?id={order_id}\nHeaders:\nAuthorization: Bearer {token}`,
    template: 'Hi {name}! Order #{id} status: {status}. Track here: {link}. Estimated arrival: {date}',
    escalation: 'Escalate if Shiprocket API returns 404 or confidence < 75%'
  },
  {
    category: 'Delivery Delay', emoji: '⏳', pct: '62%', color: '#FF6402',
    badges: ['n8n', 'Logistics', 'WhatsApp'],
    trigger: 'Logistics webhook SLA breach notification',
    condition: 'Delay > 24 hours from promised ETA',
    code: `POST {n8n_webhook_url}\nBody:\n{\n  "event": "sla_breach",\n  "order_id": "{order_id}",\n  "new_eta": "{new_date}"\n}`,
    template: 'Sorry for the delay on #{id}. Your new ETA is {date}. As an apology, Rs.50 credit has been added to your account.',
    escalation: 'Escalate if delay is > 7 days or package is marked as lost'
  },
  {
    category: 'Refund Request', emoji: '💸', pct: '45%', color: '#3395FF',
    badges: ['Instagram', 'OpenAI', 'Razorpay', 'Freshdesk'],
    trigger: 'New Instagram DM mentioning refund or return',
    condition: 'AI confidence > 80% AND order age <= 7 days',
    code: `POST https://api.razorpay.com/v1/refunds\nBody:\n{\n  "payment_id": "{payment_id}",\n  "amount": {amount},\n  "speed": "optimum"\n}`,
    template: 'Refund initiated for #{id}. Will reflect in 5-7 business days to {payment_method}.',
    escalation: 'Escalate if order is > 7 days old or payment_id is not found'
  },
  {
    category: 'Product Complaint', emoji: '⚠️', pct: '38%', color: '#25C16F',
    badges: ['Gmail', 'OpenAI', 'Freshdesk'],
    trigger: 'Email reporting damage, bad quality, or missing items',
    condition: 'Sentiment = negative AND intent = complaint',
    code: `POST https://{domain}.freshdesk.com/api/v2/tickets\nBody:\n{\n  "description": "{ai_summary}",\n  "subject": "Complaint: {order_id}",\n  "email": "{customer_email}",\n  "priority": 3,\n  "status": 2\n}`,
    template: 'We sincerely apologize for the issue with your order. We have created a high-priority ticket ({ticket_id}) and our QC team will contact you within 24 hours.',
    escalation: 'Always escalate to Freshdesk after sending acknowledgement via email'
  },
  {
    category: 'Payment Failure', emoji: '💳', pct: '72%', color: '#EA4335',
    badges: ['Gmail', 'OpenAI', 'Razorpay'],
    trigger: 'New email with subject containing "payment", "failed", or "deducted"',
    condition: 'AI confidence > 85% AND transaction_status = failed',
    code: `GET https://api.razorpay.com/v1/payments/{payment_id}\nHeaders:\nAuthorization: Basic {base64_encoded_keys}`,
    template: 'We checked your transaction. No amount was successfully deducted for order #{id}. You can retry payment here: {link}',
    escalation: 'Escalate if Razorpay confirms successful capture but our DB shows failed order'
  },
  {
    category: 'Subscription Cancellation', emoji: '🔄', pct: '68%', color: '#F57045',
    badges: ['WhatsApp', 'OpenAI', 'Chargebee'],
    trigger: 'Message requesting to stop, cancel, or pause subscription',
    condition: 'AI confidence > 85% AND active_subscription = true',
    code: `POST https://{site}.chargebee.com/api/v2/subscriptions/{subscription_id}/cancel_for_items\nHeaders:\nAuthorization: Basic {key}`,
    template: 'Your subscription has been successfully cancelled. Your access remains active until the end of your current cycle.',
    escalation: 'Escalate if customer is on an annual contract or demands prorated refund'
  },
  {
    category: 'General FAQ Query', emoji: '💬', pct: '92%', color: '#1C40A6',
    badges: ['Instagram', 'OpenAI', 'Pinecone'],
    trigger: 'Any message not matching specific transactional intents',
    condition: 'Pinecone similarity score > 0.85',
    code: `POST https://{index-host}.pinecone.io/query\nBody:\n{\n  "vector": [{embeddings}],\n  "topK": 3,\n  "includeMetadata": true\n}`,
    template: '{rag_generated_answer} — Need more help? Type AGENT to reach our support team.',
    escalation: 'Escalate if similarity score < 0.85 or customer replies AGENT'
  }
];

const AutomationPlaybook = () => {
  const [activeScenario, setActiveScenario] = useState("Order Tracking Query");
  const { queries } = useQueries();

  const automationsTriggered = queries.length;
  const apisCalled = Math.floor(automationsTriggered * 3.4);
  const ticketsDeflected = Math.floor(automationsTriggered * 0.73);
  const humanEscalations = Math.floor(automationsTriggered * 0.27);
  const avgPipelineTime = '847ms';

  const defaultSummaryText = scenarios["Order Tracking Query"].totalTime + " — Zero human involvement";

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16">
      
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#DDE6F4]">Connected Integrations</h2>
          <p className="text-[#6B7FA3]">12 platforms actively integrated into the Beastlife support pipeline</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {integrations.map((app, i) => (
            <div key={i} className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-4 hover:border-[#6B7FA3]/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ backgroundColor: app.bg, color: app.color }} className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-xl">
                  {app.icon}
                </div>
                <h3 className="text-[#DDE6F4] font-bold text-sm truncate">{app.name}</h3>
              </div>
              <p className="text-[#6B7FA3] text-xs leading-relaxed mb-4 h-8">{app.desc}</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${app.badge}`}></span>
                <span className="text-xs font-medium text-[#DDE6F4]">{app.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#141928] border border-[#1E2D4A] rounded-lg p-4 flex gap-8">
          <div className="flex flex-col">
            <span className="text-[#00C9A7] font-bold text-lg">12</span>
            <span className="text-[#6B7FA3] text-xs">Platforms Connected</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#00C9A7] font-bold text-lg">4</span>
            <span className="text-[#6B7FA3] text-xs">Channels Monitored</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#00C9A7] font-bold text-lg">7</span>
            <span className="text-[#6B7FA3] text-xs">Automation Flows Active</span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#DDE6F4]">End-to-End Automation Architecture</h2>
        </div>
        
        <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl overflow-x-auto">
          <div className="min-w-[900px] p-8 flex flex-col gap-8">
            
            <div className="flex items-center">
              <div className="w-32 shrink-0 text-xs font-bold text-[#6B7FA3] uppercase tracking-wider">① Ingestion Layer</div>
              <div className="flex gap-4 flex-1 items-center justify-between">
                <div className="flex gap-4">
                  <div className="bg-[#0B0F1A] border border-[#25D366] border-l-4 rounded p-3 w-40">
                    <div className="text-[#DDE6F4] font-bold text-sm">WhatsApp</div>
                    <div className="text-[#6B7FA3] text-xs">Webhook Trigger</div>
                  </div>
                  <div className="bg-[#0B0F1A] border border-[#E134AB] border-l-4 rounded p-3 w-40">
                    <div className="text-[#DDE6F4] font-bold text-sm">Instagram</div>
                    <div className="text-[#6B7FA3] text-xs">Webhook Trigger</div>
                  </div>
                  <div className="bg-[#0B0F1A] border border-[#EA4335] border-l-4 rounded p-3 w-40">
                    <div className="text-[#DDE6F4] font-bold text-sm">Gmail</div>
                    <div className="text-[#6B7FA3] text-xs">Webhook Trigger</div>
                  </div>
                </div>
                <div className="text-[#6B7FA3] text-xl">➔</div>
                <div className="bg-[#0B0F1A] border border-[#FF6402] border-l-4 rounded p-3 w-56">
                  <div className="text-[#DDE6F4] font-bold text-sm">n8n Orchestrator</div>
                  <div className="text-[#6B7FA3] text-xs">Normalizes & routes all messages</div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-32 shrink-0 text-xs font-bold text-[#6B7FA3] uppercase tracking-wider">② Intelligence Layer</div>
              <div className="flex gap-4 flex-1 items-center">
                <div className="ml-auto w-[60%] border-l-2 border-[#6B7FA3]/30 min-h-8"></div>
              </div>
            </div>
            
            <div className="flex items-center mt-[-2rem]">
              <div className="w-32 shrink-0"></div>
              <div className="flex gap-4 flex-1 items-center justify-end">
                <div className="bg-[#0B0F1A] border border-[#10A37F] border-l-4 rounded p-3 w-56 text-center shadow-[0_0_15px_rgba(16,163,127,0.15)]">
                  <div className="text-[#10A37F] font-bold text-sm">AI Classifier</div>
                  <div className="text-[#6B7FA3] text-xs">OpenAI</div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-32 shrink-0"></div>
              <div className="flex gap-4 flex-1 items-center justify-end">
                <div className="w-[2px] bg-[#6B7FA3]/30 h-8 ml-auto mr-28"></div>
              </div>
            </div>

            <div className="flex items-center mt-[-1rem]">
              <div className="w-32 shrink-0"></div>
              <div className="flex gap-4 flex-1 items-center justify-end">
                <div className="bg-[#0B0F1A] border border-[#1E2D4A] rounded p-3 w-64 text-center">
                  <div className="text-[#DDE6F4] font-bold text-sm mb-2">Intent Detected</div>
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="bg-[#141928] text-xs text-[#00C9A7] px-2 py-0.5 rounded">Order Tracking</span>
                    <span className="bg-[#141928] text-xs text-[#3395FF] px-2 py-0.5 rounded">Refund Request</span>
                    <span className="bg-[#141928] text-xs text-[#EA4335] px-2 py-0.5 rounded">Payment Failure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center pt-4">
              <div className="w-32 shrink-0 text-xs font-bold text-[#6B7FA3] uppercase tracking-wider">③ Resolution Layer</div>
              <div className="flex gap-8 flex-1 w-full relative">
                 <div className="absolute top-[-1.5rem] right-32 w-[60%] h-6 border-l-2 border-t-2 border-r-2 border-[#6B7FA3]/30 rounded-t-lg"></div>

                 <div className="bg-[#0B0F1A] border border-[#00C9A7] border-l-4 rounded p-3 flex-1 flex flex-col items-center">
                  <div className="text-[#DDE6F4] font-bold text-sm mb-2">Branch A: Auto-Resolve</div>
                  <div className="text-[#00C9A7] text-xl mb-2">↓</div>
                  <div className="text-[#6B7FA3] text-xs text-center">Shiprocket API<br/>Razorpay API<br/>Chargebee API</div>
                </div>

                <div className="bg-[#0B0F1A] border border-[#10A37F] border-l-4 rounded p-3 flex-1 flex flex-col items-center">
                  <div className="text-[#DDE6F4] font-bold text-sm mb-2">Branch B: AI Reply</div>
                  <div className="text-[#10A37F] text-xl mb-2">↓</div>
                  <div className="text-[#6B7FA3] text-xs text-center">WhatsApp API<br/>Gmail API<br/>Instagram API</div>
                </div>

                <div className="bg-[#0B0F1A] border border-[#FF6402] border-l-4 rounded p-3 flex-1 flex flex-col items-center">
                  <div className="text-[#DDE6F4] font-bold text-sm mb-2">Branch C: Escalate</div>
                  <div className="text-[#FF6402] text-xl mb-2">↓</div>
                  <div className="text-[#6B7FA3] text-xs text-center">Freshdesk<br/><span className="mt-1 block text-[#FF6402] font-semibold">Human Agent</span></div>
                </div>
              </div>
            </div>

            <div className="flex items-center pt-4">
              <div className="w-32 shrink-0 text-xs font-bold text-[#6B7FA3] uppercase tracking-wider">④ Output Layer</div>
              <div className="flex gap-0 flex-1 w-full justify-center relative">
                 <div className="absolute w-[60%] h-6 border-l-2 border-b-2 border-r-2 border-[#6B7FA3]/30 rounded-b-lg top-[-1.5rem]"></div>
                 <div className="pt-6 w-full flex justify-center items-center gap-4">
                   <div className="bg-[#1E2D4A] rounded px-4 py-2 text-sm font-bold text-[#DDE6F4]">Dashboard Update</div>
                   <div className="text-[#6B7FA3]">➔</div>
                   <div className="bg-[#1E2D4A] rounded px-4 py-2 text-sm font-bold text-[#DDE6F4]">Analytics Store</div>
                   <div className="text-[#6B7FA3]">➔</div>
                   <div className="bg-[#1E2D4A] rounded px-4 py-2 text-sm font-bold text-[#DDE6F4]">Alert Feed</div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#DDE6F4]">Automation Trigger Simulator</h2>
          <p className="text-[#6B7FA3]">Select a scenario to see exactly how the automation executes step by step</p>
        </div>

        <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6">
          <select 
            value={activeScenario}
            onChange={(e) => setActiveScenario(e.target.value)}
            className="w-full bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg p-3 text-[#DDE6F4] focus:outline-none focus:border-[#00C9A7] mb-8"
          >
            {Object.keys(scenarios).map(sc => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>

          <div className="relative pl-6 border-l-2 border-[#1E2D4A] ml-4 space-y-6">
            {scenarios[activeScenario].steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div 
                  className="absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-[#DDE6F4] font-bold">{step.title}</h4>
                    <p className="text-[#6B7FA3] text-sm mt-1">{step.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="bg-[#1E2D4A] text-[#DDE6F4] text-xs px-2 py-0.5 rounded font-medium">{step.badge}</span>
                    <span className="text-[#00C9A7] text-xs font-['Space_Mono']">{step.ms}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#1E2D4A]">
            <p className="text-[#00C9A7] font-bold text-lg text-center mb-4">{scenarios[activeScenario].summaryText ? scenarios[activeScenario].summaryText : "Total Resolution Time: " + scenarios[activeScenario].totalTime + " — Handled automatically"}</p>
            <div className="flex justify-center gap-4 text-xs font-bold text-[#6B7FA3] uppercase tracking-wider">
              <span className="bg-[#0B0F1A] px-3 py-1.5 rounded border border-[#1E2D4A]">Platforms Used: {scenarios[activeScenario].platforms}</span>
              <span className="bg-[#0B0F1A] px-3 py-1.5 rounded border border-[#1E2D4A]">Human Needed: {scenarios[activeScenario].humanNeeded}</span>
              <span className="bg-[#0B0F1A] px-3 py-1.5 rounded border border-[#1E2D4A]">Avg Time: {scenarios[activeScenario].totalTime}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#DDE6F4]">Automation Playbooks — Per Issue Category</h2>
        </div>

        <div className="flex flex-col gap-6">
          {playbooks.map((pb, idx) => (
            <div key={idx} className="bg-[#141928] border border-[#1E2D4A] rounded-xl overflow-hidden hover:border-[#6B7FA3]/50 transition-colors">
              
              <div className="p-6 border-b border-[#1E2D4A] bg-[#141928]/50 flex justify-between items-center" style={{ borderLeftWidth: '4px', borderLeftColor: pb.color }}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl bg-[#0B0F1A] p-3 rounded-lg border border-[#1E2D4A]">{pb.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-[#DDE6F4]">{pb.category}</h3>
                    <div className="flex gap-2 mt-2">
                      {pb.badges.map(b => (
                        <span key={b} className="text-[10px] bg-[#1E2D4A] text-[#DDE6F4] px-2 py-1 rounded uppercase tracking-wider font-bold">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[#00C9A7] text-4xl font-bold font-['Space_Mono'] tracking-tighter">{pb.pct}</span>
                  <span className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mt-1">Automated</span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg p-4">
                    <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-2">Trigger</div>
                    <div className="text-sm text-[#DDE6F4]">{pb.trigger}</div>
                  </div>
                  <div className="bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg p-4">
                    <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-2">Condition</div>
                    <div className="text-sm text-[#00C9A7] font-['Space_Mono']">{pb.condition}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-2 ml-1">Mock API Integration</div>
                  <div className="bg-[#0A0A0A] border border-[#1E2D4A] rounded-lg p-4 overflow-x-auto">
                    <pre className="text-[#8892B0] text-sm font-['Space_Mono'] m-0 whitespace-pre-wrap">{pb.code}</pre>
                  </div>
                </div>

                <div className="bg-[#0B0F1A] border border-[#1E2D4A] rounded-lg p-4">
                   <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-2">Auto-Reply Template</div>
                   <code className="text-[#00C9A7] text-sm font-['Space_Mono'] block whitespace-pre-wrap mb-4">{pb.template}</code>
                   <div className="border-t border-[#1E2D4A] pt-3 mt-3">
                     <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-1">Escalation Rule</div>
                     <div className="text-sm text-[#EA4335]">{pb.escalation}</div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#DDE6F4]">Automation Performance — This Session</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-4">
            <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-1">Automations Triggered</div>
            <div className="text-3xl font-bold text-[#DDE6F4] font-['Space_Mono']">{automationsTriggered}</div>
          </div>
          <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-4">
            <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-1">APIs Called</div>
            <div className="text-3xl font-bold text-[#DDE6F4] font-['Space_Mono']">{apisCalled}</div>
          </div>
          <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-4">
            <div className="text-[10px] text-[#00C9A7] uppercase tracking-widest font-bold mb-1">Tickets Deflected</div>
            <div className="text-3xl font-bold text-[#00C9A7] font-['Space_Mono']">{ticketsDeflected}</div>
          </div>
          <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-4">
            <div className="text-[10px] text-[#6B7FA3] uppercase tracking-widest font-bold mb-1">Avg Pipeline Time</div>
            <div className="text-3xl font-bold text-[#DDE6F4] font-['Space_Mono']">{avgPipelineTime}</div>
          </div>
          <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-4 bg-[#EA4335]/5 border-[#EA4335]/30">
            <div className="text-[10px] text-[#EA4335] uppercase tracking-widest font-bold mb-1">Human Escalations</div>
            <div className="text-3xl font-bold text-[#EA4335] font-['Space_Mono']">{humanEscalations}</div>
          </div>
        </div>

        <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6 mb-6">
          <div className="text-sm font-bold text-[#DDE6F4] mb-4">Resolution Distribution — Current Session</div>
          <div className="flex w-full h-8 rounded overflow-hidden">
            <div className="bg-[#00C9A7] w-[73%] flex items-center justify-center text-black text-xs font-bold">Auto-Resolved (73%)</div>
            <div className="bg-[#FF6402] w-[18%] flex items-center justify-center text-white text-xs font-bold">Escalated (18%)</div>
            <div className="bg-[#6B7FA3] w-[9%] flex items-center justify-center text-white text-xs font-bold">Pending (9%)</div>
          </div>
        </div>

        <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-6">
          <div className="text-sm font-bold text-[#DDE6F4] mb-4">Integration Health</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
             {integrations.map((app, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[#1E2D4A] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{app.icon}</span>
                    <span className="text-sm text-[#DDE6F4]">{app.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${app.status === 'Connected' || app.status === 'Active' ? 'bg-[#25D366]' : 'bg-[#FF6402]'}`}></span>
                    <span className="text-xs text-[#6B7FA3]">{app.status}</span>
                  </div>
                </div>
             ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default AutomationPlaybook;
