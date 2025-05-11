import { useEffect, useState } from 'react';
import { Conversation, useMessaging } from '@/hooks/useMessaging';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Search } from 'lucide-react';

export function ConversationList() {
  const { conversations, activeConversation, setActiveConversation, getMessages } = useMessaging();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(conversations);
  
  // 검색어에 따라 대화 필터링
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConversations(conversations);
      return;
    }
    
    const filtered = conversations.filter(conversation => 
      conversation.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);
  
  // 대화 선택 핸들러
  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    getMessages(conversation.userId);
  };
  
  // 아바타 색상 생성 (이름 기반)
  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // 이니셜 생성
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // 메시지 미리보기 텍스트 가져오기
  const getPreviewText = (conversation: Conversation) => {
    if (!conversation.lastMessage) return '새 대화';
    
    const { type, content } = conversation.lastMessage;
    
    if (type === 'image') return '🖼️ 이미지';
    if (type === 'notification') return '📢 알림';
    
    return content.length > 25 ? content.substring(0, 25) + '...' : content;
  };
  
  // 상대적 시간 가져오기
  const getRelativeTime = (conversation: Conversation) => {
    if (!conversation.lastMessage) return '';
    
    return formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
      addSuffix: true,
      locale: ko
    });
  };

  return (
    <div className="h-full flex flex-col border-r dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="대화 검색"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? '검색 결과가 없습니다' : '대화 내역이 없습니다'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.userId}
                className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors
                  ${activeConversation?.userId === conversation.userId
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/50'
                  }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="relative flex-shrink-0">
                  <Avatar>
                    {conversation.userAvatar ? (
                      <AvatarImage src={conversation.userAvatar} alt={conversation.userName} />
                    ) : (
                      <AvatarFallback className={getInitialsColor(conversation.userName)}>
                        {getInitials(conversation.userName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {conversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  )}
                </div>
                
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{conversation.userName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {getRelativeTime(conversation)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {getPreviewText(conversation)}
                  </div>
                </div>
                
                {conversation.unreadCount > 0 && (
                  <div className="ml-2 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}