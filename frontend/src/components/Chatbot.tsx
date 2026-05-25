import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, Bot, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I am **CloudOptima Copilot**, your FinOps AI Assistant. Ask me anything about your multi-cloud spend, forecasting, anomalies, or optimization recommendations.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "What is my next month forecast?",
    "Show idle EC2 instances",
    "How can I save cost on S3?",
    "Check security posture score"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate backend thinking delay
    setTimeout(async () => {
      let botResponse = "";
      const query = textToSend.toLowerCase();

      try {
        // Try calling the actual backend chat api
        const res = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend })
        });
        if (res.ok) {
          const data = await res.json();
          botResponse = data.reply;
        } else {
          throw new Error('Fallback to local NLP');
        }
      } catch (err) {
        // Local NLP engine fallback
        if (query.includes('forecast') || query.includes('predict') || query.includes('future')) {
          botResponse = "Based on our **AI Prophet forecasting engine**, your projected cloud spend for June 2026 is **$16,842.50** (with an 80% confidence interval of $15,900 to $17,800). This represents a **5.4% increase** from May due to EKS scaling trends. I recommend applying the EC2 scheduling recommendation to offset this increase.";
        } else if (query.includes('idle') || query.includes('recommend') || query.includes('save') || query.includes('waste')) {
          botResponse = "I found **4 active cost-saving recommendations** totalizing **$711.14/month** in potential savings:\n\n1. **Stop Idle EC2** (`prod-auth-service`): Saves **$138.24/month** (Risk: Low)\n2. **Rightsize RDS Replica** (`dev-read-replica`): Saves **$126.00/month** (Risk: Low)\n3. **S3 Storage Tiering** (`finance-logs-archive`): Saves **$280.50/month** (Risk: Low)\n4. **Spot Instances** (`payment-gateway` cluster): Saves **$166.40/month** (Risk: Med)\n\nYou can apply these directly from the **Recommendations** panel.";
        } else if (query.includes('s3') || query.includes('storage') || query.includes('glacier')) {
          botResponse = "Your S3 storage costs are currently **$342.10/month** (mainly under the `finance-logs-archive` bucket). Moving objects older than 90 days from Standard to **Glacier Deep Archive** will save **$280.50/month** (82% cost reduction) with no performance impact on historical logs access.";
        } else if (query.includes('security') || query.includes('compliance') || query.includes('posture')) {
          botResponse = "Your **Security & Compliance Posture Score is 82/100**. Critical violations:\n\n* **MFA is disabled** on 3 IAM console roles.\n* **S3 Buckets** without server-side encryption enabled (2 buckets).\n* **Idle access keys** over 90 days active (1 key).\n\nCheck the **Compliance** tab to view remediation steps.";
        } else if (query.includes('rds') || query.includes('database')) {
          botResponse = "You are running **2 RDS instances** costed at **$1.05/hour** combined. The main Database `prod-core-db` is well-sized (32.5% CPU), but the replica `dev-read-replica` is running with **under 2% CPU utilization** for 14 days. Downsizing this replica will save **$126.00/month**.";
        } else if (query.includes('kubernetes') || query.includes('eks') || query.includes('pod') || query.includes('k8s')) {
          botResponse = "Your Kubernetes cost efficiency score is **74%**. We detected over-provisioned CPU and Memory limits in the `billing` namespace: pods are utilizing only **34% of allocated CPU requests**. Downsizing EKS resource limits will free up node capacity and allow autoscaler to scale down 1 EC2 instance, saving **$140.00/month**.";
        } else {
          botResponse = "I can help you audit and optimize your multi-cloud estate. Try asking me:\n* *'Show me idle servers'* \n* *'What is my forecasted cost next month?'* \n* *'How do I optimize S3 storage?'* \n* *'Summarize my compliance issues'*";
        }
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-96 h-[500px] mb-4 rounded-2xl glass-panel border border-brand-teal/20 shadow-glass-glow flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-brand-teal/10 via-brand-purple/10 to-brand-teal/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-teal/20 flex items-center justify-center border border-brand-teal/30">
                  <Sparkles className="w-4 h-4 text-brand-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1">
                    CloudOptima Copilot
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-gray-400">FinOps AI Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-teal/10 border border-brand-teal/20 text-white rounded-br-none'
                        : 'bg-white/5 border border-white/5 text-gray-300 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-brand-teal font-semibold">
                        <Bot className="w-3.5 h-3.5" /> COPILOT AI
                      </div>
                    )}
                    {/* Render paragraphs and bold markup */}
                    <div className="whitespace-pre-line">
                      {msg.text.split('**').map((chunk, i) =>
                        i % 2 === 1 ? <strong key={i} className="text-brand-teal font-semibold">{chunk}</strong> : chunk
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 text-gray-300 rounded-2xl rounded-bl-none px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestionChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(chip)}
                    className="text-[11px] px-2.5 py-1 bg-white/5 hover:bg-brand-teal/10 hover:text-brand-teal border border-white/5 hover:border-brand-teal/20 rounded-full transition-colors text-gray-400"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="p-3 border-t border-white/5 bg-obsidian-950/50 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask AI Copilot..."
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-brand-teal flex items-center justify-center hover:bg-brand-teal/80 disabled:opacity-50 disabled:hover:bg-brand-teal text-obsidian-950 font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-teal to-brand-purple flex items-center justify-center shadow-glass-glow text-white border border-white/10 relative"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-rose border-2 border-obsidian-950 rounded-full animate-ping" />
      </motion.button>
    </div>
  );
};

export default Chatbot;
