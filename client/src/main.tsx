import React from 'react';
import ReactDOM from "react-dom/client";
import "./index.css";
import TestApp from "./TestApp";

// 간단한 테스트 앱으로 기본 렌더링만 확인
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <TestApp />
    </React.StrictMode>
  );
}
