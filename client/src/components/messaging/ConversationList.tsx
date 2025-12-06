import { useState, useMemo, useCallback } from 'react';
import { Conversation, useMessaging } from '@/hooks/useMessaging';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessagesSquare, Loader2 } from 'lucide-react';
import { ConversationItem } from './ConversationItem';
import { NewConversationButton } from './NewConversationDialog';

export function ConversationList() {
  const { conversations, activeConversation, setActiveConversation, isLoadingConversations, refreshMessages } = useMessaging();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 검색어에 따라 대화 필터링 (메모이제이션 적용)
  const filteredConversations = useMemo(() => {
    if (searchTerm.trim() === '') {
      return conversations;
    }
    
    return conversations.filter(conversation => 
      conversation.participant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, conversations]);
  
  // 대화 선택 핸들러
  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setActiveConversation(conversation);
    refreshMessages();
  }, [setActiveConversation, refreshMessages]);

  return (
    <div className="h-full flex flex-col border-r dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <MessagesSquare className="mr-2 h-5 w-5" />
          메시지
        </h2>
        
        <NewConversationButton />
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="대화 검색"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-conversations"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {isLoadingConversations ? (
          <div className="p-4 text-center text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <div>대화 목록 불러오는 중...</div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? '검색 결과가 없습니다' : '대화 내역이 없습니다'}
            {!searchTerm && (
              <div className="mt-2 text-sm">
                <p>상단의 <strong>새 대화 시작</strong> 버튼을 클릭하여 새로운 대화를 시작하세요.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation?.id === conversation.id}
                onClick={() => handleSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
