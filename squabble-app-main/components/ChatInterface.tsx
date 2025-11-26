import React, { useState, useEffect, useRef } from 'react';
import { Match, Message } from '../types';
import { generateChatReply } from '../services/geminiService';
import { Send, ChevronLeft, Video, Flag, MoreVertical, ShieldAlert, Bot } from 'lucide-react';
import { VideoCallModal } from './VideoCallModal';

interface ChatInterfaceProps {
  match: Match;
  apiKey: string;
  onBack: () => void;
  onUpdateMatch: (matchId: string, history: Message[], lastMessage: string) => void;
  onUnmatch: (matchId: string) => void;
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ match, apiKey, onBack, onUpdateMatch, onUnmatch, notify }) => {
  // Initialize state from match.history to ensure persistence
  const [messages, setMessages] = useState<Message[]>(match.history || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message from bot if empty (and no previous history)
    if (messages.length === 0) {
      const initialMsg: Message = { 
        id: Date.now().toString(), 
        sender: 'fighter', 
        text: "What you looking at?", 
        timestamp: Date.now() 
      };
      
      const newHistory = [initialMsg];
      setMessages(newHistory);
      // Persist immediately
      onUpdateMatch(match.id, newHistory, initialMsg.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  
  const handleTrashTalk = async () => {
    setInputText(await generateChatReply(apiKey, match.fighter, messages, true));
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    // Optimistic update
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    
    // Sync with parent immediately
    onUpdateMatch(match.id, updatedHistory, userMsg.text);

    // Generate reply (AI or Scripted Fallback)
    setIsTyping(true);
    try {
        const replyText = await generateChatReply(apiKey, match.fighter, updatedHistory);
        
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'fighter',
          text: replyText,
          timestamp: Date.now()
        };

        const finalHistory = [...updatedHistory, botMsg];
        setMessages(finalHistory);
        setIsTyping(false);

        // Sync bot response with parent
        onUpdateMatch(match.id, finalHistory, botMsg.text);
    } catch (e) {
        console.error("Failed to generate reply", e);
        setIsTyping(false);
    }
  };

  const handleReport = () => {
      notify('User reported for bad behavior.', 'success');
      setShowMenu(false);
  };

  const handleUnmatch = () => {
      onUnmatch(match.id);
      notify('You unmatched this user.', 'info');
      onBack();
  };

  return (
    <div className="flex flex-col h-full bg-black relative animate-in slide-in-from-right">
      {isVideoCall && (
          <VideoCallModal fighter={match.fighter} onEndCall={() => setIsVideoCall(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-squabble-dark border-b border-gray-800 relative z-20">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-heading font-bold text-xl uppercase tracking-wider animate-laser-pulse text-shadow-laser">{match.fighter.name}</span>
           <span className="text-[10px] text-green-500 uppercase font-bold tracking-widest">Online & Angry</span>
        </div>
        <div className="flex items-center">
            <button 
                onClick={() => setIsVideoCall(true)}
                className="p-2 text-squabble-red mr-1 hover:text-white transition-colors animate-laser-pulse text-shadow-laser"
            >
                <Video size={24} />
            </button>
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-400 hover:text-white relative">
                <MoreVertical size={24} />
            </button>
        </div>
        
        {/* Dropdown Menu */}
        {showMenu && (
            <div className="absolute top-16 right-4 bg-gray-900 border border-gray-700 rounded-xl shadow-xl w-48 overflow-hidden z-30">
                <button 
                    onClick={handleReport}
                    className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center gap-2 text-red-500 font-bold uppercase text-xs animate-laser-pulse text-shadow-laser"
                >
                    <Flag size={14} /> Report User
                </button>
                <button 
                    onClick={handleUnmatch}
                    className="w-full text-left px-4 py-3 hover:bg-gray-800 flex items-center gap-2 text-gray-400 font-bold uppercase text-xs animate-laser-pulse text-shadow-laser"
                >
                    <ShieldAlert size={14} /> Unmatch
                </button>
            </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        <div className="flex justify-center mb-4">
             <div className="bg-gray-900/50 text-[10px] text-gray-500 px-3 py-1 rounded-full uppercase border border-gray-800">
                 Encrypted Chat • Keep it in the ring
             </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-squabble-red text-white rounded-br-none' 
                : 'bg-gray-800 text-gray-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none">
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-squabble-dark border-t border-gray-800 relative z-20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Talk trash..."
            className="flex-1 bg-gray-900 border border-gray-700 text-white p-3 rounded-full focus:outline-none focus:border-squabble-red"
          />
          <button 
            onClick={handleTrashTalk}
            className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
          >
            <Bot size={20} />
          </button>
          <button 
            onClick={handleSend}
            className="p-3 bg-squabble-red rounded-full text-white hover:bg-red-700 transition-colors animate-laser-pulse text-shadow-laser"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};