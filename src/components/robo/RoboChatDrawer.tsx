import React, { useState, useRef, useEffect } from 'react';
import { RoboContext, RoboMessage } from '../../types/robo';
import {
  X,
  Minus,
  Send,
  Bot,
  Lightbulb,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface RoboChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: RoboContext;
}

const INITIAL_MESSAGES: RoboMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'robo',
    text: "Hi! Need help with your project? I'm your AI Civil Engineer companion. I can explain civil terminology, evaluate spatial layouts, and guide your construction planning in simple language.",
    timestamp: 'Just now',
    suggestedQuestions: [
      'What does RCC mean?',
      'Explain this room in simple words.',
      'What should I consider before adding another floor?',
      'What is a foundation?',
      'Why is this layout useful?',
    ],
  },
];

export const RoboChatDrawer: React.FC<RoboChatDrawerProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const [messages, setMessages] = useState<RoboMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (questionText?: string) => {
    const query = questionText || input;
    if (!query.trim()) return;

    const userMsg: RoboMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateRoboReply(query, context);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-h-[580px] rounded-3xl glass-panel-gold border shadow-2xl flex flex-col overflow-hidden animate-slideUp select-none theme-card">
      {/* Drawer Header */}
      <div className="p-3.5 bg-theme-surface/95 border-b border-theme-subtle flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-400 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-theme-primary flex items-center space-x-1.5">
              <span>👷 BuildVision Engineer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </h4>
            <p className="text-[10px] text-theme-muted font-mono">AI Civil Companion • Active</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onClose}
            title="Minimize"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-black/20 rounded-lg transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-black/20 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Context Banner */}
      <div className="px-3.5 py-1.5 bg-theme-base/90 border-b border-theme-subtle text-[10px] font-mono text-gold-400 flex items-center justify-between">
        <span className="truncate max-w-[180px]">
          {context.projectName ? `Project: ${context.projectName}` : 'BuildVision Platform'}
        </span>
        <span>
          {context.selectedRoomName
            ? `Room: ${context.selectedRoomName}`
            : context.totalFloors > 0
            ? `${context.totalFloors} Floors`
            : 'Ready to assist'}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 max-h-[350px] text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[86%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 font-medium shadow-md rounded-br-none'
                  : 'bg-theme-surface/90 border border-theme-subtle text-theme-primary rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}

              {msg.civilTip && (
                <div className="mt-2 pt-2 border-t border-theme-subtle text-[11px] text-gold-400 flex items-start space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{msg.civilTip}</span>
                </div>
              )}
            </div>

            {/* Suggested Follow-up chips if any */}
            {msg.suggestedQuestions && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {msg.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-[10px] text-left px-2.5 py-1.5 rounded-xl bg-theme-surface/80 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 border border-theme-subtle transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 text-xs text-theme-muted bg-theme-surface border border-theme-subtle p-2.5 rounded-2xl w-24">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-theme-surface/95 border-t border-theme-subtle">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a construction question…"
            className="flex-1 bg-theme-base border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-primary placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold disabled:opacity-40 transition-colors shadow-gold-glow"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Educational Disclaimer */}
        <p className="text-[9px] text-theme-muted mt-2 text-center leading-tight">
          Educational guidance only. Always consult a licensed structural engineer for official approvals.
        </p>
      </div>
    </div>
  );
};

function generateRoboReply(query: string, context: RoboContext): RoboMessage {
  const lower = query.toLowerCase();
  let text = '';
  let tip = '';

  if (lower.includes('rcc')) {
    text = "RCC stands for Reinforced Cement Concrete. Concrete alone is extremely strong against compressive weight (pressing down), but brittle against tensile forces (pulling or bending). By casting high-grade ductile ribbed steel rebars (such as Fe550D TMT bars) into the concrete matrix, the structure safely resists both gravity loads and horizontal seismic tremors.";
    tip = "For residential multistory structures, M20 or M25 design-mix concrete with high-ductility TMT bars is universal practice.";
  } else if (lower.includes('adding') && (lower.includes('floor') || lower.includes('another'))) {
    text = `Before erecting an additional floor over an existing structure, a civil engineer evaluates three core parameters: 1) Existing column cross-sections and foundation soil bearing capacity, 2) Presence of structural column rebar starter dowels on the terrace slab, and 3) Local municipal Floor Area Ratio (FAR) & setback regulations.`;
    tip = "Using lightweight Autoclaved Aerated Concrete (AAC) blocks reduces super-imposed dead load by up to 40% compared to traditional red clay bricks.";
  } else if (lower.includes('foundation')) {
    text = "The foundation is the substructure component that distributes the entire dead load, live load, and wind/seismic pressure into the underlying strata. Common types include Isolated Column Footings (standard soil), Combined Footings (closely spaced columns), and Raft/Mat Foundations (soft or low-bearing clay soils).";
    tip = "Always conduct a Standard Penetration Test (SPT) soil bore test to depth before casting footings.";
  } else if (lower.includes('room') && (lower.includes('explain') || lower.includes('simple') || lower.includes('why') || lower.includes('layout'))) {
    if (context.selectedRoomName) {
      text = `The ${context.selectedRoomName} is designed with a clear area of ${context.selectedRoomArea ? Math.round(context.selectedRoomArea) : 'standard'} sq.ft. It is proportioned to guarantee ergonomic circulation walkways (minimum 3 feet clearance around furniture) while orienting window openings to facilitate cross-ventilation and daylight harvesting.`;
      tip = "Bedrooms are acoustically buffered away from entry foyers and vehicular parking bays for maximum acoustic privacy.";
    } else {
      text = "Our architectural layout organizes spaces into functional zones: Active public reception (Foyer, Living, Dining, Parking) at the ground level, and peaceful private sanctuaries (Master Suite, Ensuite Bath, Balconies) on upper floors for enhanced privacy and natural ventilation.";
    }
  } else if (lower.includes('why') && lower.includes('layout')) {
    text = "This layout uses a modular structural column grid (typically 3.5m to 4.5m spans). This avoids costly cantilever beams, maximizes usable square footage with zero dead circulation corridors, and aligns plumbing ducts vertically to simplify MEP maintenance.";
  } else if (lower.includes('cost') || lower.includes('estimate') || lower.includes('price')) {
    text = `Your preliminary estimated turnkey cost is ₹${context.estimatedCost.toLocaleString()} (approx. ₹2,000/sq.ft for a ${context.totalAreaSqFt.toLocaleString()} sq.ft building). This covers structural earthwork, RCC superstructure, masonry, electrical/plumbing conduit networks, and premium vitrified tiling.`;
    tip = "You can edit any material unit rate in the BOQ tab to match your local regional market rates.";
  } else {
    text = `Excellent question! In ${context.projectName || 'this building'}, the structural geometry and room proportions are optimized to meet standard architectural codes. Would you like me to explain the foundation requirements, material takeoff, or spatial circulation?`;
    tip = "You can click on any room directly in the 3D viewer to inspect its exact square footage, dimensions, and floor finishes.";
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'robo',
    text,
    civilTip: tip || undefined,
    timestamp: 'Just now',
  };
}
