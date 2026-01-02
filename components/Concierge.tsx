import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Wrench } from 'lucide-react';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse, Chat } from '@google/genai';

const Concierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Welcome to Rocket Motor Co. I\'m the shop specialist. Interested in a specific build or looking for a classic to add to your stable?',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      const session = createChatSession();
      if (session) {
        chatSessionRef.current = session;
      } else {
        setMessages(prev => [...prev, {
            id: 'error',
            role: 'model',
            text: 'System offline (Missing API Key).',
            timestamp: Date.now()
        }]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await sendMessageStream(chatSessionRef.current, userMsg.text);
      
      let botResponseText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          botResponseText += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: botResponseText } : msg
          ));
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "The shop line is breaking up. Try again in a moment.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        } bg-rocket-600 hover:bg-rocket-700 text-white border-2 border-white/10`}
        aria-label="Open Specialist Chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] sm:w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl shadow-2xl transition-all duration-300 transform origin-bottom-right flex flex-col ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
      }`} style={{ height: '500px' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-rocket-600 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-display font-bold tracking-wide">ROCKET SPECIALIST</h3>
              <p className="text-xs text-rocket-100">Live from the shop floor</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-rocket-100 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-850">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-slate-700' : 'bg-rocket-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-slate-700 text-white rounded-tr-none' 
                  : 'bg-white text-slate-900 rounded-tl-none shadow-md'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900 rounded-b-xl border-t border-slate-700">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about specs, history..."
              disabled={isLoading}
              className="w-full bg-slate-800 text-white pl-4 pr-12 py-3 rounded-lg border border-slate-700 focus:border-rocket-500 focus:outline-none focus:ring-1 focus:ring-rocket-500 placeholder-slate-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-rocket-500 hover:text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Concierge;