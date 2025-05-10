import React from 'react';
import { motion } from 'framer-motion';

interface DogLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  color?: string;
  className?: string;
}

export function DogLoading({
  size = 'md',
  text = '로딩 중...',
  color = '#8B5CF6', // 기본 색상 (보라색)
  className = '',
}: DogLoadingProps) {
  // 사이즈에 따른 너비 설정
  const sizeMap = {
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-40',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeMap[size]}`}>
        {/* 강아지 몸통 */}
        <motion.div
          className="relative w-full aspect-square rounded-full bg-amber-200"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* 귀 - 왼쪽 */}
          <motion.div 
            className="absolute w-1/3 h-1/3 bg-amber-300 rounded-full -left-1/6 -top-1/6"
            animate={{
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* 귀 - 오른쪽 */}
          <motion.div 
            className="absolute w-1/3 h-1/3 bg-amber-300 rounded-full -right-1/6 -top-1/6"
            animate={{
              rotate: [5, -5, 5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* 눈 - 왼쪽 */}
          <div className="absolute w-[15%] h-[15%] bg-gray-800 rounded-full left-1/4 top-1/3" />
          
          {/* 눈 - 오른쪽 */}
          <div className="absolute w-[15%] h-[15%] bg-gray-800 rounded-full right-1/4 top-1/3" />
          
          {/* 코 */}
          <div className="absolute w-[20%] h-[12%] bg-gray-800 rounded-full left-[40%] top-[45%]" />
          
          {/* 입 */}
          <div className="absolute w-[30%] h-[8%] border-b-2 border-gray-800 rounded-b-full left-[35%] top-[55%]" />
        </motion.div>
        
        {/* 로딩 점들 */}
        <div className="flex justify-center mt-4 space-x-2">
          <motion.div
            className={`w-2 h-2 rounded-full`}
            style={{ backgroundColor: color }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className={`w-2 h-2 rounded-full`}
            style={{ backgroundColor: color }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className={`w-2 h-2 rounded-full`}
            style={{ backgroundColor: color }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
      
      {text && (
        <div className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
          {text}
        </div>
      )}
    </div>
  );
}