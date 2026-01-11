
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";

interface JointPoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

interface MotionAnalysis {
  joints: JointPoint[];
  movementSpeed: number;
  postureTilt: number;
  limbAngles: {
    frontLeft: number;
    frontRight: number;
    backLeft: number;
    backRight: number;
  };
  activityType: string;
  estimatedPain: boolean;
}

interface Props {
  motionAnalysis: MotionAnalysis;
  imageUrl?: string;
}

export default function MotionAnalysisVisualizer({ motionAnalysis, imageUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !motionAnalysis.joints) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSkeleton = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 이미지가 있으면 배경으로 그리기
      if (imageUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawJointsAndConnections();
        };
        img.src = imageUrl;
      } else {
        drawJointsAndConnections();
      }
    };

    const drawJointsAndConnections = () => {
      const joints = motionAnalysis.joints;
      
      // 관절 연결선 정의
      const connections = [
        ["목", "왼쪽 어깨"],
        ["목", "오른쪽 어깨"],
        ["왼쪽 어깨", "왼쪽 팔꿈치"],
        ["왼쪽 팔꿈치", "왼쪽 앞발"],
        ["오른쪽 어깨", "오른쪽 팔꿈치"],
        ["오른쪽 팔꿈치", "오른쪽 앞발"],
        ["왼쪽 어깨", "왼쪽 엉덩이"],
        ["오른쪽 어깨", "오른쪽 엉덩이"],
        ["왼쪽 엉덩이", "왼쪽 무릎"],
        ["왼쪽 무릎", "왼쪽 뒷발"],
        ["오른쪽 엉덩이", "오른쪽 무릎"],
        ["오른쪽 무릎", "오른쪽 뒷발"],
        ["왼쪽 엉덩이", "꼬리 시작"],
        ["오른쪽 엉덩이", "꼬리 시작"],
        ["꼬리 시작", "꼬리 끝"]
      ];

      // 연결선 그리기
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 3;
      
      connections.forEach(([start, end]) => {
        const startJoint = joints.find(j => j.name === start);
        const endJoint = joints.find(j => j.name === end);
        
        if (startJoint && endJoint) {
          ctx.beginPath();
          ctx.moveTo(startJoint.x * canvas.width, startJoint.y * canvas.height);
          ctx.lineTo(endJoint.x * canvas.width, endJoint.y * canvas.height);
          ctx.stroke();
        }
      });

      // 관절 포인트 그리기
      joints.forEach(joint => {
        const x = joint.x * canvas.width;
        const y = joint.y * canvas.height;
        
        // 신뢰도에 따른 색상
        const color = joint.confidence > 0.8 
          ? 'rgb(34, 197, 94)' // 녹색 - 높은 신뢰도
          : joint.confidence > 0.6 
          ? 'rgb(234, 179, 8)' // 노란색 - 중간 신뢰도
          : 'rgb(239, 68, 68)'; // 빨간색 - 낮은 신뢰도

        // 외곽선
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // 중심점
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // 레이블
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText(joint.name, x + 10, y - 10);
      });
    };

    drawSkeleton();
  }, [motionAnalysis, imageUrl]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>관절 포인트 분석</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full border rounded-lg bg-gray-50"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">모션 분석 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">활동 유형:</span>
              <Badge variant="outline">{motionAnalysis.activityType}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">움직임 속도:</span>
              <span className="font-medium">{motionAnalysis.movementSpeed.toFixed(1)} m/s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">자세 기울기:</span>
              <span className="font-medium">{motionAnalysis.postureTilt}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">통증 징후:</span>
              {motionAnalysis.estimatedPain ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  감지됨
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  정상
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">사지 각도</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">왼쪽 앞다리:</span>
              <span className="font-medium">{motionAnalysis.limbAngles.frontLeft}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">오른쪽 앞다리:</span>
              <span className="font-medium">{motionAnalysis.limbAngles.frontRight}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">왼쪽 뒷다리:</span>
              <span className="font-medium">{motionAnalysis.limbAngles.backLeft}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">오른쪽 뒷다리:</span>
              <span className="font-medium">{motionAnalysis.limbAngles.backRight}°</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">관절 포인트 상세 ({motionAnalysis.joints.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-2">관절명</th>
                  <th className="text-center p-2">X</th>
                  <th className="text-center p-2">Y</th>
                  <th className="text-center p-2">신뢰도</th>
                </tr>
              </thead>
              <tbody>
                {motionAnalysis.joints.map((joint, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{joint.name}</td>
                    <td className="text-center p-2">{(joint.x * 100).toFixed(1)}%</td>
                    <td className="text-center p-2">{(joint.y * 100).toFixed(1)}%</td>
                    <td className="text-center p-2">
                      <Badge 
                        variant={joint.confidence > 0.8 ? "default" : "secondary"}
                        className={joint.confidence > 0.8 ? "bg-green-500" : ""}
                      >
                        {(joint.confidence * 100).toFixed(0)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
