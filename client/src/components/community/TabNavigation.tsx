import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabValue } from '@/types/community';

interface TabNavigationProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  className?: string;
}

const TAB_LABELS: Record<TabValue, string> = {
  latest: '최신',
  popular: '인기',
  training: '훈련팁',
  survey: '설문',
  info: '정보공유',
  notices: '공지사항'
};

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  className = '' 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TabValue)} className={className}>
      <TabsList className="grid w-full grid-cols-6">
        {Object.entries(TAB_LABELS).map(([value, label]) => (
          <TabsTrigger 
            key={value} 
            value={value}
            data-testid={`tab-${value}`}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;