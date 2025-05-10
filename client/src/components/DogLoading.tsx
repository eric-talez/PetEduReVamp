import React from 'react';

interface DogLoadingProps {
  text?: string;
  className?: string;
}

/**
 * 강아지 모양 로딩 컴포넌트
 * CSS만으로 구현하여 이중 렌더링 방지 및 안정성 향상
 */
export function DogLoading({ text = '로딩 중...', className = '' }: DogLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="dog-loading-container">
        <div className="dog">
          <div className="dog-body"></div>
          <div className="dog-tail"></div>
          <div className="dog-head">
            <div className="dog-ears">
              <div className="dog-ear"></div>
              <div className="dog-ear"></div>
            </div>
            <div className="dog-face">
              <div className="dog-eyes">
                <div className="dog-eye"></div>
                <div className="dog-eye"></div>
              </div>
              <div className="dog-nose"></div>
              <div className="dog-mouth"></div>
            </div>
          </div>
          <div className="dog-legs">
            <div className="dog-leg"></div>
            <div className="dog-leg"></div>
            <div className="dog-leg"></div>
            <div className="dog-leg"></div>
          </div>
        </div>
        
        <style>{`
          .dog-loading-container {
            position: relative;
            width: 120px;
            height: 120px;
          }
          
          .dog {
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .dog-body {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 40px;
            background-color: #f8c291;
            border-radius: 20px;
            animation: body-bounce 1s infinite alternate;
          }
          
          .dog-tail {
            position: absolute;
            top: 40%;
            left: 15%;
            width: 15px;
            height: 8px;
            background-color: #f8c291;
            border-radius: 10px;
            transform-origin: right center;
            animation: tail-wag 0.5s infinite alternate;
          }
          
          .dog-head {
            position: absolute;
            top: 30%;
            left: 70%;
            width: 40px;
            height: 35px;
            background-color: #ffeaa7;
            border-radius: 50%;
            z-index: 2;
            animation: head-tilt 2s infinite alternate;
          }
          
          .dog-ears {
            position: absolute;
            width: 100%;
            height: 100%;
          }
          
          .dog-ear {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #fab1a0;
            border-radius: 50%;
          }
          
          .dog-ear:first-child {
            top: -8px;
            left: -5px;
            transform: rotate(-30deg);
            animation: ear-twitch 1.5s infinite alternate;
          }
          
          .dog-ear:last-child {
            top: -8px;
            right: -5px;
            transform: rotate(30deg);
            animation: ear-twitch 1.7s 0.2s infinite alternate;
          }
          
          .dog-face {
            position: absolute;
            width: 100%;
            height: 100%;
          }
          
          .dog-eyes {
            position: absolute;
            top: 35%;
            width: 100%;
            display: flex;
            justify-content: space-around;
          }
          
          .dog-eye {
            width: 8px;
            height: 8px;
            background-color: #2d3436;
            border-radius: 50%;
            animation: blink 3s infinite;
          }
          
          .dog-nose {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 0);
            width: 10px;
            height: 8px;
            background-color: #2d3436;
            border-radius: 50%;
          }
          
          .dog-mouth {
            position: absolute;
            top: 65%;
            left: 50%;
            transform: translate(-50%, 0);
            width: 15px;
            height: 5px;
            border-bottom: 2px solid #2d3436;
            border-radius: 0 0 10px 10px;
          }
          
          .dog-legs {
            position: absolute;
            bottom: 15%;
            width: 100%;
            height: 20px;
            display: flex;
            justify-content: space-around;
          }
          
          .dog-leg {
            width: 8px;
            height: 20px;
            background-color: #f8c291;
            border-radius: 5px;
          }
          
          .dog-leg:nth-child(1) {
            animation: leg-move 0.7s infinite alternate;
          }
          
          .dog-leg:nth-child(3) {
            animation: leg-move 0.7s 0.1s infinite alternate;
          }
          
          .dog-leg:nth-child(2) {
            animation: leg-move 0.7s 0.2s infinite alternate;
          }
          
          .dog-leg:nth-child(4) {
            animation: leg-move 0.7s 0.3s infinite alternate;
          }
          
          @keyframes body-bounce {
            0% {
              transform: translate(-50%, -50%);
            }
            100% {
              transform: translate(-50%, -45%);
            }
          }
          
          @keyframes tail-wag {
            0% {
              transform: rotate(-20deg);
            }
            100% {
              transform: rotate(20deg);
            }
          }
          
          @keyframes head-tilt {
            0% {
              transform: rotate(-5deg);
            }
            100% {
              transform: rotate(5deg);
            }
          }
          
          @keyframes ear-twitch {
            0% {
              transform: rotate(-30deg);
            }
            100% {
              transform: rotate(-20deg);
            }
          }
          
          @keyframes blink {
            0%, 45%, 55%, 100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(0.1);
            }
          }
          
          @keyframes leg-move {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
      
      {text && (
        <div className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300 flex space-x-1">
          <span>{text}</span>
          <span className="inline-flex">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
          </span>
        </div>
      )}
    </div>
  );
}