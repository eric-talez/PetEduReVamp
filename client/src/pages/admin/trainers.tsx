import React from 'react';
import AdminTrainersComponent from './trainers-admin';

/**
 * /admin/trainers 경로를 위한 중계 컴포넌트
 */
export default function TrainersPage() {
  console.log('[DEBUG] 훈련사 관리 페이지 렌더링 - trainers.tsx');
  return <AdminTrainersComponent />;
}