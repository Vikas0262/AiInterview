import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const Sidebar = ({ onNewChat }) => {
  const [isNamingChat, setIsNamingChat] = useState(false);
  const [chatName, setChatName] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleNewChatClick = () => {
    setIsNamingChat(true);
  };

  const handleChatNameSubmit = (e) => {
    e.preventDefault();
    if (chatName.trim()) {
      const newChat = {
        id: Date.now(),
        name: chatName,
        timestamp: new Date()
      };
      setChatHistory([newChat, ...chatHistory]);
      setChatName('');
      setIsNamingChat(false);
      onNewChat();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen fixed left-0 top-0 pt-16 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        {isNamingChat ? (
          <form onSubmit={handleChatNameSubmit} className="relative">
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Name your chat"
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setIsNamingChat(false);
                setChatName('');
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </form>
        ) : (
          <button
            onClick={handleNewChatClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus />
            <span>New Chat</span>
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Recent Chats
        </h3>
        {chatHistory.length > 0 ? (
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
              >
                <span className="truncate">{chat.name}</span>
                <span className="text-xs text-gray-400">{formatTime(chat.timestamp)}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="px-4 py-2 text-sm text-gray-500">No recent chats</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
