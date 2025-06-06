import React, { useState } from 'react';
import { FiPlus, FiMessageSquare, FiFolder, FiFileText, FiClock, FiStar, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [showChatLists, setShowChatLists] = useState({
    favorites: true,
    code: true,
    marketing: true,
  });
  const navigate = useNavigate();

  const toggleChatList = (list) => {
    setShowChatLists(prev => ({
      ...prev,
      [list]: !prev[list]
    }));
  };

  const startNewChat = () => {
    setActiveChat(null);
    navigate('/chat/new');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={startNewChat}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <FiPlus className="mr-2" />
            New chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Navigation */}
            <div className="space-y-1">
              <NavItem icon={<FiMessageSquare />} active>Chats</NavItem>
              <NavItem icon={<FiFolder />}>Projects</NavItem>
              <NavItem icon={<FiFileText />}>Templates</NavItem>
              <NavItem icon={<FiFileText />}>Documents</NavItem>
              <NavItem icon={<FiClock />}>History</NavItem>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Chat Lists */}
            <div className="space-y-4">
              <ChatListSection 
                title="FAVORITES" 
                isOpen={showChatLists.favorites}
                toggleOpen={() => toggleChatList('favorites')}
                items={[
                  { id: 'fav1', name: 'Project Brainstorm' },
                  { id: 'fav2', name: 'Code Review' },
                ]}
                icon={<FiStar className="text-yellow-400" />}
              />
              
              <ChatListSection 
                title="CODE" 
                isOpen={showChatLists.code}
                toggleOpen={() => toggleChatList('code')}
                items={[
                  { id: 'code1', name: 'React Components' },
                  { id: 'code2', name: 'API Integration' },
                ]}
                icon={<span className="text-xs">#</span>}
              />
              
              <ChatListSection 
                title="MARKETING" 
                isOpen={showChatLists.marketing}
                toggleOpen={() => toggleChatList('marketing')}
                items={[
                  { id: 'mkt1', name: 'Q2 Campaign' },
                  { id: 'mkt2', name: 'Social Media' },
                ]}
                icon={<span className="text-xs">#</span>}
              />
              
              <div className="pt-2 border-t border-gray-200">
                <NavItem icon={<FiClock />}>Archived</NavItem>
                <NavItem icon={<FiTrash2 />}>Deleted</NavItem>
                <button className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  <span className="mr-2">+</span> New list
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
              A
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Alexis</div>
              <div className="text-xs text-gray-500">Free Plan</div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <FiChevronDown />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

const NavItem = ({ icon, children, active = false }) => (
  <Link
    to="#"
    className={`flex items-center px-3 py-2 text-sm rounded-lg ${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {children}
  </Link>
);

const ChatListSection = ({ title, isOpen, toggleOpen, items, icon }) => (
  <div>
    <button
      onClick={toggleOpen}
      className="flex items-center w-full text-left text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-3 py-1 rounded hover:bg-gray-100"
    >
      <span className="mr-2">{icon}</span>
      {title}
      <FiChevronDown
        className={`ml-auto transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        size={14}
      />
    </button>
    {isOpen && (
      <div className="space-y-1 pl-8">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/chat/${item.id}`}
            className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 truncate"
          >
            {item.name}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default ChatLayout;
