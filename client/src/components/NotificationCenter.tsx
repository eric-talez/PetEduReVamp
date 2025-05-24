// 기존 NotificationCenter 컴포넌트를 리다이렉트하는 파일
// 새로운 알림 시스템으로 마이그레이션하기 위한 파일입니다.
import { NotificationCenter as NewNotificationCenter } from './ui/notification-center';

export const NotificationCenter = NewNotificationCenter;