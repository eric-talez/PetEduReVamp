import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Navigation, AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Place } from '@/hooks/useMapService';

interface MapFallbackProps {
  places?: Place[];
  onRefresh?: () => void;
  error?: string;
  center?: { latitude: number; longitude: number };
  className?: string;
}

export const MapFallback: React.FC<MapFallbackProps> = ({
  places = [],
  onRefresh,
  error,
  center = { latitude: 37.5665, longitude: 126.978 },
  className = ""
}) => {
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'institute':
        return '🎓 훈련소';
      case 'trainer':
        return '👨‍🏫 훈련사';
      case 'clinic':
        return '🏥 동물병원';
      case 'shop':
        return '🏪 용품점';
      case 'pension':
        return '🏨 펜션';
      case 'cafe':
        return '☕ 카페';
      case 'park':
        return '🌳 공원';
      default:
        return '📍 장소';
    }
  };

  const openInKakaoMap = () => {
    const url = `https://map.kakao.com/link/map/${center.latitude},${center.longitude}`;
    window.open(url, '_blank');
  };

  const openPlaceInKakaoMap = (place: Place) => {
    const url = `https://map.kakao.com/link/map/${place.name},${place.location.latitude},${place.location.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 오류 메시지 */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle className="text-base text-orange-800">카카오맵 설정 필요</CardTitle>
              <CardDescription className="text-orange-600 text-sm">
                카카오 개발자 콘솔에서 웹 플랫폼 지도 서비스를 활성화해주세요 (HTTP 404 오류)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded border">
              <p className="font-medium mb-2">🔧 설정 방법:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>카카오 개발자 콘솔 접속</li>
                <li>앱 설정 > 플랫폼 > Web 추가</li>
                <li>지도/로컬 서비스 활성화</li>
                <li>도메인 등록 (localhost:5000)</li>
              </ol>
            </div>
            <div className="flex gap-2">
              {onRefresh && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRefresh}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  다시 시도
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openInKakaoMap}
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                카카오맵에서 보기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 장소 목록 */}
      {places.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              검색된 장소 ({places.length}개)
            </CardTitle>
            <CardDescription>
              지도 대신 목록으로 장소 정보를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {places.map((place, index) => (
                <div 
                  key={place.id || index}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{place.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(place.type)}
                        </Badge>
                        {place.isCertified && (
                          <Badge variant="default" className="text-xs">
                            인증
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {place.location.address || "주소 정보 없음"}
                      </p>
                      {place.contact && (
                        <p className="text-xs text-muted-foreground">
                          📞 {place.contact}
                        </p>
                      )}
                      {place.openingHours && (
                        <p className="text-xs text-muted-foreground">
                          🕒 {place.openingHours}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {place.rating && (
                        <Badge variant="outline" className="text-xs">
                          ⭐ {place.rating}
                        </Badge>
                      )}
                      {place.distance && (
                        <span className="text-xs text-muted-foreground">
                          {(place.distance / 1000).toFixed(1)}km
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {place.contact && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs flex-1"
                        onClick={() => window.open(`tel:${place.contact}`)}
                      >
                        전화
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs flex-1"
                      onClick={() => openPlaceInKakaoMap(place)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      지도보기
                    </Button>
                    {place.location && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs flex-1"
                        onClick={() => {
                          const url = `https://map.kakao.com/link/to/${place.name},${place.location.latitude},${place.location.longitude}`;
                          window.open(url, '_blank');
                        }}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        길찾기
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 위치 정보 */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">
              📍 현재 위치: {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
            </p>
            <p>
              💡 팁: 외부 카카오맵 링크를 통해 정확한 위치와 길찾기를 이용할 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapFallback;