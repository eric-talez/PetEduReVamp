// 테스트용 에러 파일 - AI 자동 수정 테스트

import { React } from 'react'; // 잘못된 import - 수정 필요
import { CardFooterr } from '@/components/ui/card'; // 오타 - 수정 필요

interface TestInterface {
  name: string;
  age: numbre; // 오타 - 수정 필요
}

function TestComponent() {
  const data: TestInterface = {
    name: "테스트",
    age: "30" // 타입 에러 - 수정 필요
  };

  // 미사용 변수
  const unusedVar = "test";

  return (
    <div>
      <h1>{data.name}</h1>
      <p>나이: {data.age}</p>
      <CardFooterr> // 잘못된 컴포넌트명
        테스트 푸터
      </CardFooterr>
    </div>
  );
}

export default TestComponent;