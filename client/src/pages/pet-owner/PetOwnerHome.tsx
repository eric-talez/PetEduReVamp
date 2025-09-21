import { useAuth } from '@/lib/auth-compat';

export default function PetOwnerHome() {
  const { userName } = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">반려인 대시보드</h1>
      <p className="text-lg mb-4">안녕하세요, {userName}님!</p>
      <p>이곳은 반려인 홈 페이지입니다. 향후 반려인에게 필요한 기능들이 추가될 예정입니다.</p>
    </div>
  );
}