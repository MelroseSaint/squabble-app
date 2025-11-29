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
    <div className="flex flex-col h-full bg-transparent relative animate-in slide-in-from-right">
      {isVideoCall && (
        <VideoCallModal fighter={match.fighter} onEndCall={() => setIsVideoCall(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-fb-card border-b border-transparent relative z-20 rounded-t-lg shadow-sm">
        <button onClick={onBack} className="p-2 text-fb-text-secondary hover:text-fb-text">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-xl text-fb-text">{match.fighter.name}</span>
          <span className="text-[10px] text-green-500 font-bold">Active Now</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsVideoCall(true)}
            className="p-2 text-fb-blue mr-1 hover:bg-fb-hover rounded-full transition-colors"
          >
            <Video size={24} />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-fb-blue hover:bg-fb-hover rounded-full relative">
            <MoreVertical size={24} />
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-16 right-4 bg-fb-card border border-gray-700 rounded-xl shadow-xl w-48 overflow-hidden z-30">
            <button
              onClick={handleReport}
              className="w-full text-left px-4 py-3 hover:bg-fb-hover flex items-center gap-2 text-fb-text font-bold text-xs"
            >
              <Flag size={14} /> Report User
            </button>
            <button
              onClick={handleUnmatch}
              className="w-full text-left px-4 py-3 hover:bg-fb-hover flex items-center gap-2 text-fb-text font-bold text-xs"
            >
              <ShieldAlert size={14} /> Unmatch
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 bg-transparent">
        <div className="flex justify-center mb-4">
          <div className="bg-fb-card text-[10px] text-fb-text-secondary px-3 py-1 rounded-full border border-transparent">
            Facebook Messenger • End-to-end encrypted
          </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                ? 'bg-fb-blue text-white'
                : 'bg-fb-hover text-fb-text'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-fb-hover p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-fb-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-fb-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-fb-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-fb-card border-t border-transparent relative z-20 rounded-b-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-fb-hover border border-transparent text-fb-text p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-fb-blue px-4"
          />
          <button
            onClick={handleTrashTalk}
            className="p-2 text-fb-blue hover:bg-fb-hover rounded-full transition-colors"
          >
            <Bot size={24} />
          </button>
          <button
            onClick={handleSend}
            className="p-2 text-fb-blue hover:bg-fb-hover rounded-full transition-colors"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};