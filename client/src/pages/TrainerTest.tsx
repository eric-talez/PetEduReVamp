import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function TrainerTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openModal = () => {
    console.log("버튼 클릭됨");
    setMessage("모달이 열렸습니다");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("모달 닫기 클릭됨");
    setMessage("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">모달 테스트 페이지</h1>
      <p className="mb-4">아래 버튼을 클릭하여 모달을 열어보세요.</p>
      
      <Button onClick={openModal}>모달 열기</Button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-2">테스트 모달</h2>
            <p className="mb-4">이것은 테스트 모달입니다.</p>
            <p className="mb-4">메시지: {message}</p>
            <Button onClick={closeModal}>닫기</Button>
          </div>
        </div>
      )}
    </div>
  );
}