'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minus, Maximize2, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBubbleProps {
  mode: 'client' | 'admin';
}

export default function AIChatBubble({ mode }: AIChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const config = {
    client: {
      title: 'LuxeVoyage AI Assistant',
      subtitle: 'Chuyên gia tư vấn du lịch',
      welcome: 'Xin chào 👋 Tôi là trợ lý du lịch AI. Tôi có thể giúp bạn tìm tour phù hợp hôm nay!',
      color: 'blue',
    },
    admin: {
      title: 'Admin AI Insights',
      subtitle: 'Trợ lý quản lý hệ thống',
      welcome: 'Chào bạn! Tôi là trợ lý AI dành cho quản trị viên. Tôi có thể giúp bạn phân tích dữ liệu, kiểm tra đơn hàng hoặc hướng dẫn sử dụng hệ thống.',
      color: 'indigo',
    }
  }[mode];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: config.welcome,
        timestamp: new Date()
      }]);
    }
  }, [mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const messageText = inputValue.trim();
    if (!messageText) return;

    const userMsg: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api/v1'}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          mode: mode
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Xin lỗi, tôi gặp sự cố khi kết nối với hệ thống. Vui lòng thử lại sau.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white dark:bg-[#0f1420] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className={`p-6 bg-${config.color}-600 text-white flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">{config.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{config.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-transparent"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className={`p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10' 
                      : 'bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-white/5 p-4 rounded-[1.5rem] rounded-tl-none border border-gray-100 dark:border-white/5">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-[#161d2b] border-t border-gray-100 dark:border-white/5">
            <div className="relative group">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-[#0f1420] rounded-2xl border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[8px] text-gray-400 mt-3 font-black uppercase tracking-widest">Powered by LuxeVoyage AI Engine</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.5rem] bg-${config.color}-600 text-white flex items-center justify-center shadow-2xl shadow-${config.color}-600/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group relative`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-4 border-white dark:border-gray-950 rounded-full animate-bounce"></div>
      </button>
    </div>
  );
}
