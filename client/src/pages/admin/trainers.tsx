import React from 'react';
import AdminTrainers from './AdminTrainers';

/**
 * 훈련사 관리 페이지
 * 이 파일은 '/admin/trainers' 경로에 대한 라우트 처리를 위해 존재합니다.
 * 실제 구현은 AdminTrainers.tsx 파일에 있으며, 이 파일은 단순히 해당 컴포넌트를 가져와 렌더링합니다.
 */
export default function TrainersPage() {
  console.log('[DEBUG] TrainersPage 컴포넌트 렌더링');
  return <AdminTrainers />;
}