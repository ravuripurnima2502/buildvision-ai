import React, { useState, useRef, useEffect } from 'react';
import { RoboContext, RoboMessage } from '../../types/robo';
import { findCatalogItem, FURNITURE_CATALOG } from '../3d/FurnitureCatalog';
import { buildRoomRegistry, findRoomByNameOrType } from '../3d/RoomRegistry';
import {
  X,
  Minus,
  Send,
  Bot,
  Lightbulb,
  Sparkles,
  HelpCircle,
  Armchair,
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
    text: "Hi! I'm your AI Civil Engineer & Architectural Copilot. You can ask me civil questions, or tell me to furnish any room (e.g. 'Add a fridge in the kitchen', 'Put a sofa in the hall', 'Kitchen lo fridge add cheyyi').",
    timestamp: 'Just now',
    suggestedQuestions: [
      'Add a fridge in the kitchen',
      'Put a sofa in the hall',
      'Add a wardrobe to bedroom 1',
      'Kitchen lo fridge add cheyyi',
      'What does RCC mean?',
      'Explain this room in simple words.',
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
    }, 500);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-h-[580px] rounded-3xl bg-[#0B1017]/95 backdrop-blur-2xl border border-gold-500/40 shadow-2xl flex flex-col overflow-hidden animate-slideUp select-none">
      {/* Drawer Header */}
      <div className="p-3.5 bg-white/[0.02] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-display font-bold text-white flex items-center space-x-1.5">
              <span>👷 BuildVision Civil Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">BIM &amp; Civil Engineering Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onClose}
            title="Minimize"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Context Banner */}
      <div className="px-3.5 py-1.5 bg-[#080C14] border-b border-white/[0.06] text-[10px] font-mono text-gold-400 flex items-center justify-between">
        <span className="truncate max-w-[180px]">
          {context.projectName ? `Project: ${context.projectName}` : 'BuildVision Platform'}
        </span>
        <span className="text-slate-400">
          {context.selectedRoomName
            ? `Room: ${context.selectedRoomName}`
            : context.totalFloors > 0
            ? `${context.totalFloors} Levels`
            : 'Active'}
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
              className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 font-medium shadow-md rounded-br-none'
                  : 'bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.civilTip && (
                <div className="mt-2 pt-2 border-t border-white/[0.08] text-[11px] text-gold-400 flex items-start space-x-1.5">
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
                    className="text-[10px] text-left px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-gold-500/15 text-gold-400 hover:text-gold-300 border border-white/[0.08] transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08] p-2.5 rounded-2xl w-24">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white/[0.02] border-t border-white/[0.08]">
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
            placeholder="Ask questions or say 'Add fridge in kitchen'…"
            className="flex-1 bg-[#080C14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold disabled:opacity-40 transition-colors shadow-gold-glow cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Educational Disclaimer */}
        <p className="text-[9px] text-slate-400 mt-2 text-center leading-tight font-mono">
          Parametric civil estimation companion • Multilingual commands supported.
        </p>
      </div>
    </div>
  );
};

/**
 * Natural language intent parser for Furniture & Appliance addition.
 * Supports English, Telugu, and Hindi patterns with aliases.
 */
function parseFurnitureIntent(query: string): { itemQuery: string; roomQuery?: string } | null {
  const q = query.toLowerCase().trim();

  // Pattern 1: Telugu patterns
  // "kitchen lo fridge add cheyyi", "hall lo sofa pettu", "bedroom lo wardrobe veyyi"
  const teluguMatch = q.match(/(.+?)\s+lo\s+(.+?)(?:\s+(?:add\s+cheyyi|pettu|veyyi|pettuko))?$/i);
  if (teluguMatch) {
    const roomPart = teluguMatch[1].trim();
    let itemPart = teluguMatch[2].replace(/(?:add\s+cheyyi|pettu|veyyi|pettuko)/gi, '').trim();
    return { itemQuery: itemPart, roomQuery: roomPart };
  }

  // Pattern 2: Hindi patterns
  // "kitchen mein fridge lagao", "hall me sofa add karo", "bedroom me bed daalo"
  const hindiMatch = q.match(/(.+?)\s+(?:mein|me)\s+(.+?)(?:\s+(?:lagao|add\s+karo|daalo|rakho))?$/i);
  if (hindiMatch) {
    const roomPart = hindiMatch[1].trim();
    let itemPart = hindiMatch[2].replace(/(?:lagao|add\s+karo|daalo|rakho)/gi, '').trim();
    return { itemQuery: itemPart, roomQuery: roomPart };
  }

  // Pattern 3: English patterns
  // "add a fridge in the kitchen", "put a sofa in the hall", "place wardrobe in bedroom"
  const englishMatch = q.match(/(?:add|put|place|install)\s+(?:a|an|the)?\s*(.+?)\s+(?:in|into|to|inside|at)\s+(?:the)?\s*(.+)/i);
  if (englishMatch) {
    return { itemQuery: englishMatch[1].trim(), roomQuery: englishMatch[2].trim() };
  }

  // Pattern 4: "Add [item] here" / "Put [item] here"
  const hereMatch = q.match(/(?:add|put|place|install)\s+(?:a|an|the)?\s*(.+?)\s+here/i);
  if (hereMatch) {
    return { itemQuery: hereMatch[1].trim(), roomQuery: 'here' };
  }

  // Pattern 5: Direct search if query contains a known furniture item
  for (const item of FURNITURE_CATALOG) {
    if (item.aliases.some((a) => q.includes(a)) || q.includes(item.name.toLowerCase())) {
      // Check if room name is also mentioned
      const words = q.split(/\s+/);
      const roomKeywords = ['kitchen', 'hall', 'living', 'bedroom', 'bed room', 'dining', 'bathroom', 'bath', 'balcony', 'study', 'utility'];
      const foundRoom = roomKeywords.find((rk) => q.includes(rk));
      return { itemQuery: item.id, roomQuery: foundRoom };
    }
  }

  return null;
}

function generateRoboReply(query: string, context: RoboContext): RoboMessage {
  const lower = query.toLowerCase();

  // CHECK: Does this match a Furniture / Add Element action?
  const furnitureIntent = parseFurnitureIntent(query);
  if (furnitureIntent && context.onAddElement && context.currentSpec) {
    const catalogItem = findCatalogItem(furnitureIntent.itemQuery);
    if (!catalogItem) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'robo',
        text: `I couldn't identify "${furnitureIntent.itemQuery}" in our furniture catalog. Try asking for a refrigerator, sofa, bed, wardrobe, dining table, TV, or washing machine.`,
        timestamp: 'Just now',
      };
    }

    const registry = buildRoomRegistry(context.currentSpec);

    // Target room determination
    let targetRoom: any;
    if (furnitureIntent.roomQuery === 'here' || !furnitureIntent.roomQuery) {
      if (context.selectedRoomId) {
        targetRoom = registry.find((r) => r.id === context.selectedRoomId);
      }
    } else {
      targetRoom = findRoomByNameOrType(registry, furnitureIntent.roomQuery);
    }

    if (!targetRoom && furnitureIntent.roomQuery && furnitureIntent.roomQuery !== 'here') {
      return {
        id: `msg_${Date.now()}`,
        sender: 'robo',
        text: `I couldn't find a room matching "${furnitureIntent.roomQuery}" in the current project.`,
        timestamp: 'Just now',
      };
    }

    // Execute central action!
    const result = context.onAddElement(catalogItem.id, targetRoom?.id);

    const roomName = targetRoom ? targetRoom.name : 'the room';
    let replyText = `✓ Added ${catalogItem.name}\n\nRoom: ${roomName}\nPlacement: Auto-positioned inside room boundary\nEstimated Cost: ₹${catalogItem.estimatedCost.toLocaleString()}`;

    let tip = `Cost updated in preliminary BOQ under Furniture & Appliances.`;
    if (result && result.warning) {
      tip = result.warning;
    }

    return {
      id: `msg_${Date.now()}`,
      sender: 'robo',
      text: replyText,
      civilTip: tip,
      timestamp: 'Just now',
    };
  }

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
    text = `Your preliminary estimated turnkey cost is ₹${context.estimatedCost.toLocaleString()} (approx. ₹2,000/sq.ft for a ${context.totalAreaSqFt.toLocaleString()} sq.ft building). This covers structural earthwork, RCC superstructure, masonry, electrical/plumbing conduit networks, finishes, and placed interior furniture.`;
    tip = "You can edit any material unit rate in the BOQ tab or add appliances to see real-time cost impact.";
  } else {
    text = `Excellent question! In ${context.projectName || 'this building'}, you can customize surface finishes, paint colors, and add furniture directly by clicking or chatting. Would you like me to add furniture, explain structural takeoff, or inspect room circulation?`;
    tip = "Try telling me: 'Add a fridge in the kitchen' or 'Put a sofa in the hall'!";
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'robo',
    text,
    civilTip: tip || undefined,
    timestamp: 'Just now',
  };
}
