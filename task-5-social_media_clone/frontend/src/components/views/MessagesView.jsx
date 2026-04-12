import React, { useState, useEffect, useRef } from 'react';
import { PlusSquare, ArrowLeft, Phone, Video, Info, Smile, Image as ImageIcon, Heart, Send } from 'lucide-react';

export default function MessagesView({ userProfile, messagesMap, setMessagesMap, suggestedUsers = [] }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatText, setChatText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callState, setCallState] = useState(null); // 'calling', 'connected', 'no_answer'
  const [callType, setCallType] = useState(null); // 'audio', 'video'
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const callTimeoutRef = useRef(null);

  const emojis = [
    '😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '🥺', '😭', '😤', 
    '😡', '🤯', '😱', '🤔', '😎', '😴', '🥱', '🤢', '🥳', '🤡',
    '❤️', '✨', '🔥', '👍', '👎', '👏', '🙌', '🙏', '🤝', '💪',
    '💯', '🎉', '🎊', '🎁', '🎈', '🎂', '🐶', '🐱', '🚀', '⭐',
    '💀', '👽', '🍔', '🍕', '🍻', '☕', '⚽', '🏀', '🎮', '🎵'
  ];

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeChat) {
      const imageUrl = URL.createObjectURL(file);
      const newMsg = { id: Date.now(), text: '', imageUrl: imageUrl, isMine: true };
      setMessagesMap(prev => ({
        ...prev,
        [activeChat.id]: [...getMessages(activeChat.id), newMsg]
      }));
    }
    if (e.target) e.target.value = null; // reset input
  };

  const startCall = (type) => {
    setCallType(type);
    setCallState('calling');
    
    // Premade bots have low IDs (e.g., <= 10) or specific usernames
    const isBot = activeChat.id <= 10 || ['intern_vibecode', 'tech_guru', 'react.devs', 'django_masters'].includes(activeChat.username);

    if (isBot) {
      // Connect quickly, then disconnect
      callTimeoutRef.current = setTimeout(() => {
        setCallState('connected');
        callTimeoutRef.current = setTimeout(() => {
          endCall();
        }, 1500);
      }, 2000);
    } else {
      // Real user wait, then no answer
      callTimeoutRef.current = setTimeout(() => {
        setCallState('no_answer');
        callTimeoutRef.current = setTimeout(() => {
          endCall();
        }, 3000);
      }, 60000); // Wait 1 minute
    }
  };

  const endCall = () => {
    clearTimeout(callTimeoutRef.current);
    setCallState(null);
    setCallType(null);
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
          {suggestedUsers.map(u => (
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
              <Phone 
                onClick={() => startCall('audio')}
                className="w-6 h-6 text-white cursor-pointer hover:text-neutral-400 transition-colors" 
              />
              <Video 
                onClick={() => startCall('video')}
                className="w-6 h-6 text-white cursor-pointer hover:text-neutral-400 transition-colors" 
              />
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
                  {m.text && <div>{m.text}</div>}
                  {m.imageUrl && (
                    <img src={m.imageUrl} alt="uploaded" className="rounded-xl w-full h-auto object-cover max-h-48 shadow-lg border border-white/10" />
                  )}
                  {m.postAttachment && (
                    <div className="mt-2 rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/20">
                      <img src={m.postAttachment.image} alt="post" className="w-full h-auto object-cover max-h-48" />
                      <div className="p-2 text-xs backdrop-blur-md bg-black/40">
                        <span className="font-semibold">{m.postAttachment.user.username}</span>{' '}
                        <span className="text-white/80 line-clamp-1">{m.postAttachment.caption}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 pt-2 glass border-t border-neutral-800 relative">
            {showEmojiPicker && (
              <div className="absolute bottom-full left-4 mb-2 bg-neutral-900 border border-neutral-800 rounded-xl p-3 shadow-2xl grid grid-cols-5 md:grid-cols-8 gap-1 overflow-y-auto max-h-48 animate-fade-in z-50 animate-slide-up-fade">
                {emojis.map(emoji => (
                  <button 
                    key={emoji} 
                    onClick={() => setChatText(prev => prev + emoji)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-neutral-800 rounded-lg text-lg transition-colors active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            <div className="border border-neutral-600 rounded-full flex items-center px-4 py-2.5 bg-black/50 focus-within:border-neutral-400 transition-colors">
              <div className="relative">
                <Smile 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`w-6 h-6 mr-3 cursor-pointer transition-colors flex-shrink-0 ${showEmojiPicker ? 'text-white' : 'text-neutral-400 hover:text-white'}`} 
                />
              </div>
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
                  <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />
                  <ImageIcon 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-6 h-6 cursor-pointer hover:text-neutral-300 transition-colors" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Call Overlay */}
          {callState && (
            <div className="absolute inset-0 bg-neutral-900 border-l border-neutral-800 z-[100] flex flex-col items-center justify-center animate-fade-in">
              {callType === 'video' && callState === 'connected' ? (
                <div className="absolute inset-0 bg-neutral-800">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-her-laptop-312-large.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              ) : null}

              <div className="relative z-10 flex flex-col items-center w-full h-full pt-20">
                <div className="relative mb-6">
                  <img src={activeChat.avatar} className="w-32 h-32 rounded-full object-cover border-4 border-neutral-800 shadow-2xl" alt="avatar" />
                  {callState === 'calling' && (
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-75" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{activeChat.username}</h2>
                <p className="text-neutral-400 text-lg mb-auto">
                  {callState === 'calling' && `${callType === 'video' ? 'Video' : 'Voice'} Calling...`}
                  {callState === 'connected' && `0:01`}
                  {callState === 'no_answer' && `Call not picked`}
                </p>

                <div className="flex items-center gap-6 pb-20">
                  {callState === 'calling' && (
                    <button className="w-14 h-14 rounded-full bg-neutral-800/80 backdrop-blur-md hover:bg-neutral-700 flex items-center justify-center transition-colors">
                      {callType === 'video' ? <Video className="w-6 h-6 text-white" /> : <Phone className="w-6 h-6 text-white" />}
                    </button>
                  )}
                  <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    <Phone className="w-8 h-8 text-white rotate-[135deg]" />
                  </button>
                </div>
              </div>
            </div>
          )}
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
