import { useEffect, useState, useMemo, useCallback } from 'react';
import { Conversation, useMessaging } from '@/hooks/useMessaging';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { ConversationItem } from './ConversationItem';

export function ConversationList() {
  const { conversations, activeConversation, setActiveConversation, getMessages } = useMessaging();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 검색어에 따라 대화 필터링 (메모이제이션 적용)
  const filteredConversations = useMemo(() => {
    if (searchTerm.trim() === '') {
      return conversations;
    }
    
    return conversations.filter(conversation => 
      conversation.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, conversations]);
  
  // 대화 선택 핸들러
  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setActiveConversation(conversation);
    getMessages(conversation.userId);
  }, [setActiveConversation, getMessages]);

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
              <ConversationItem
                key={conversation.userId}
                conversation={conversation}
                isActive={activeConversation?.userId === conversation.userId}
                onClick={() => handleSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}