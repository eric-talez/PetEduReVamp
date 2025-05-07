
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ShopPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">반려견 용품</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
          <h3 className="font-semibold mb-2">프리미엄 트레이닝 용품</h3>
          <p className="text-sm text-gray-600 mb-4">전문가가 추천하는 훈련용품</p>
          <Button className="w-full">구매하기</Button>
        </Card>
      </div>
    </div>
  );
}
