import React, { useState, useEffect, useRef } from 'react';
import { PlusSquare, ArrowLeft, Phone, Video, Info, Smile, Image as ImageIcon, Heart, Send } from 'lucide-react';
import { mockSuggestions } from '../../data/mockData';

export default function MessagesView({ userProfile }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatText, setChatText] = useState('');
  const [messagesMap, setMessagesMap] = useState({});
  const messagesEndRef = useRef(null);

  const getMessages = (userId) => {
    return messagesMap[userId] || [
      { id: 1, text: `Hey ${userProfile.username}! How is the internship going?`, isMine: false },
      { id: 2, text: 'Learning a ton about React and Django!', isMine: true }
    ];
  };

  const handleSend = () => {
    if (chatText.trim() && activeChat) {
      const newMsg = { id: Date.now(), text: chatText, isMine: true };
      setMessagesMap(prev => ({
        ...prev,
        [activeChat.id]: [...getMessages(activeChat.id), newMsg]
      }));
      setChatText('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesMap, activeChat]);

  const activeMessages = activeChat ? getMessages(activeChat.id) : [];

  return (
    <div className="w-full max-w-[935px] h-[calc(100vh-125px)] md:h-[calc(100vh-80px)] mx-auto md:mt-8 md:border border-neutral-800 md:rounded-xl flex animate-slide-up-fade overflow-hidden bg-black/50 backdrop-blur-sm">
      {/* Sidebar */}
      <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-[350px] border-r border-neutral-800 flex-col h-full bg-black/60`}>
        <div className="p-4 md:p-6 border-b border-neutral-800 font-bold text-lg flex justify-between items-center cursor-pointer">
          {userProfile.username}
          <div className="p-2 hover:bg-neutral-900 rounded-lg transition-colors">
            <PlusSquare className="w-6 h-6" />
          </div>
        </div>
        <div className="p-4">
          <span className="font-semibold text-base">Messages</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
          {mockSuggestions.map(u => (
            <div
              key={u.id}
              onClick={() => setActiveChat(u)}
              className={`flex items-center gap-3 py-3 px-4 hover:bg-white/5 cursor-pointer transition-colors active:bg-white/10 ${activeChat?.id === u.id ? 'bg-white/5' : ''}`}
            >
              <img src={u.avatar} className="w-14 h-14 rounded-full object-cover" alt="avatar" />
              <div className="flex-1">
                <div className="font-normal text-sm">{u.username}</div>
                <div className="text-xs text-neutral-500 truncate">{u.relation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeChat ? (
        <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col h-full bg-black/40 relative`}>
          <div className="flex items-center gap-3 p-4 border-b border-neutral-800 glass">
            <button className="md:hidden p-1 mr-1 active:scale-90 transition-transform" onClick={() => setActiveChat(null)}>
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <img src={activeChat.avatar} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" alt="avatar" />
            <div className="flex-1 font-semibold">{activeChat.username}</div>
            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-white cursor-pointer hover:text-neutral-400 transition-colors" />
              <Video className="w-6 h-6 text-white cursor-pointer hover:text-neutral-400 transition-colors" />
              <Info className="w-6 h-6 text-white cursor-pointer hover:text-neutral-400 hidden sm:block transition-colors" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex flex-col items-center justify-center text-neutral-400 py-6">
              <img src={activeChat.avatar} className="w-24 h-24 rounded-full mb-4 object-cover" alt="avatar" />
              <span className="font-bold text-white text-lg">{activeChat.username}</span>
              <span className="text-sm text-neutral-500">Vibegram</span>
              <button className="mt-4 bg-white/10 px-4 py-1.5 rounded-lg text-sm text-white hover:bg-white/20 transition-colors">
                View Profile
              </button>
            </div>

            {activeMessages.map(m => (
              <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'} animate-slide-up-fade`}>
                <div className={`max-w-[70%] px-4 py-2.5 text-sm shadow-md ${
                  m.isMine
                    ? 'btn-gradient text-white rounded-2xl rounded-br-sm'
                    : 'bg-neutral-800 text-white rounded-2xl rounded-bl-sm border border-neutral-700'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 pt-2 glass border-t border-neutral-800">
            <div className="border border-neutral-600 rounded-full flex items-center px-4 py-2.5 bg-black/50 focus-within:border-neutral-400 transition-colors">
              <Smile className="w-6 h-6 text-neutral-400 mr-3 cursor-pointer hover:text-white transition-colors flex-shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-neutral-500"
                placeholder="Message..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              {chatText.trim() ? (
                <button onClick={handleSend} className="text-purple-500 font-bold text-sm ml-3 hover:text-purple-400 transition-colors">
                  Send
                </button>
              ) : (
                <div className="flex gap-3 ml-3 text-white">
                  <ImageIcon className="w-6 h-6 cursor-pointer hover:text-neutral-300 transition-colors" />
                  <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-neutral-400 h-full bg-black/40">
          <div className="w-24 h-24 border-2 border-neutral-800 rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-pink-900/20" />
            <Send className="w-10 h-10 text-white relative z-10" />
          </div>
          <h2 className="text-xl font-normal text-white mb-1">Your Messages</h2>
          <p className="text-sm mb-6">Send private photos and messages to a friend or group.</p>
          <button className="btn-gradient text-white font-semibold py-2 px-6 rounded-lg transition-transform active:scale-95 shadow-lg">
            Send Message
          </button>
        </div>
      )}
    </div>
  );
}
