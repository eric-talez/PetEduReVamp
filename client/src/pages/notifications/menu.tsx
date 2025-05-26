import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Calendar, 
  Info, 
  MessageSquare,
  Package, 
  Shield, 
  Star, 
  Tag 
} from "lucide-react";
import { useLocation } from "wouter";

interface NotificationsMenuProps {
  currentPath: string;
}

export default function NotificationsMenu({ currentPath }: NotificationsMenuProps) {
  const [location, navigate] = useLocation();
  
  const isActive = (path: string) => currentPath === path;
  
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">알림 유형</h3>
      
      <div className="space-y-2">
        <Button 
          variant={isActive("/notifications") ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/notifications")}
        >
          <Bell className="mr-2 h-4 w-4" />
          전체 알림
        </Button>
        <Button 
          variant={isActive("/notifications/system") ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/notifications/system")}
        >
          <Info className="mr-2 h-4 w-4" />
          시스템 알림
        </Button>
        <Button 
          variant={isActive("/notifications/training") ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/notifications/training")}
        >
          <Star className="mr-2 h-4 w-4" />
          훈련 피드백
        </Button>
        <Button 
          variant={isActive("/notifications/event") ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/notifications/event")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          일정 알림
        </Button>
        <Button 
          variant={isActive("/notifications/payment") ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/notifications/payment")}
        >
          <Tag className="mr-2 h-4 w-4" />
          결제 알림
        </Button>
        <Button 
          variant={isActive("/notifications/security") ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/notifications/security")}
        >
          <Shield className="mr-2 h-4 w-4" />
          보안 알림
        </Button>
        <Button 
          variant={isActive("/notifications/order") ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/notifications/order")}
        >
          <Package className="mr-2 h-4 w-4" />
          주문 알림
        </Button>
      </div>
    </Card>
  );
}