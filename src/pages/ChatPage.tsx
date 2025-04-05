import React, { useState } from 'react';
import { Search, Send, Users, Phone, Video } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ChatPage = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Chat List */}
          <ChatListItem
            name="Study Group"
            lastMessage="When are we meeting next?"
            time="2m ago"
            unread={3}
            isGroup
          />
          <ChatListItem
            name="Alex Chen"
            lastMessage="Thanks for the notes!"
            time="1h ago"
            unread={0}
            avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces"
          />
          <ChatListItem
            name="Sarah Johnson"
            lastMessage="See you at the library"
            time="2h ago"
            unread={1}
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces"
              alt="Alex Chen"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-900">Alex Chen</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Message
            text="Hey! How's the project coming along?"
            time="2:30 PM"
            isOwn={false}
            avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces"
          />
          <Message
            text="Going great! I've finished the research part. Would you like to review it?"
            time="2:31 PM"
            isOwn={true}
          />
          <Message
            text="Sure! Send it over and I'll take a look."
            time="2:32 PM"
            isOwn={false}
            avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces"
          />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Button>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatListItem = ({ 
  name, 
  lastMessage, 
  time, 
  unread, 
  isGroup, 
  avatar 
}: { 
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
  avatar?: string;
}) => (
  <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
    <div className="flex items-center space-x-3">
      {isGroup ? (
        <div className="bg-indigo-100 rounded-full p-2">
          <Users className="h-6 w-6 text-indigo-600" />
        </div>
      ) : (
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
      </div>
      {unread > 0 && (
        <div className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unread}
        </div>
      )}
    </div>
  </div>
);

const Message = ({ 
  text, 
  time, 
  isOwn, 
  avatar 
}: { 
  text: string;
  time: string;
  isOwn: boolean;
  avatar?: string;
}) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {!isOwn && avatar && (
        <img src={avatar} alt="" className="w-8 h-8 rounded-full" />
      )}
      <div className={`rounded-lg px-4 py-2 ${isOwn ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
        <p>{text}</p>
        <span className={`text-xs ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>{time}</span>
      </div>
    </div>
  </div>
);

export default ChatPage;