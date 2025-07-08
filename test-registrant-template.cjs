const xlsx = require('xlsx');
const path = require('path');

// 등록자 정보를 포함한 엑셀 템플릿 생성
function createRegistrantTemplate() {
  // 워크북 생성
  const workbook = xlsx.utils.book_new();
  
  // 시트 데이터 생성
  const data = [
    ['TALEZ 커리큘럼 등록 양식', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['등록자 정보', '', '', '', '', '', ''],
    ['등록자명', '한성규', '', '', '', '', ''],
    ['등록자 이메일', 'hansung@talez.com', '', '', '', '', ''],
    ['등록자 전화번호', '010-1234-5678', '', '', '', '', ''],
    ['소속기관', '테일즈 교육원', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['커리큘럼 기본정보', '', '', '', '', '', ''],
    ['제목', '반려견 행동교정 전문과정', '', '', '', '', ''],
    ['설명', '문제행동 교정 전문 교육과정', '', '', '', '', ''],
    ['카테고리', '전문가과정', '', '', '', '', ''],
    ['전체가격', '300000', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['회차', '제목', '설명', '시간(분)', '목표', '무료여부', '준비물'],
    ['1', '행동 이해와 분석', '반려견 기본 행동 패턴 이해', '90', '행동 분석 능력 향상', 'Y', '노트, 펜'],
    ['2', '기초 복종훈련', '기본 명령어 훈련법', '120', '명령어 훈련법 습득', 'N', '간식, 클리커'],
    ['3', '문제행동 교정', '문제행동 교정 기법', '150', '교정 기법 습득', 'N', '교정 도구, 간식'],
    ['4', '보호자 교육', '보호자 지도법', '120', '지도법 습득', 'N', '교육 자료']
  ];
  
  // 워크시트 생성
  const worksheet = xlsx.utils.aoa_to_sheet(data);
  
  // 시트를 워크북에 추가
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // 파일 저장
  const fileName = 'test-curriculum-with-registrant.xlsx';
  xlsx.writeFile(workbook, fileName);
  
  console.log(`등록자 정보 포함 엑셀 템플릿 생성 완료: ${fileName}`);
  return fileName;
}

// 실행
try {
  const fileName = createRegistrantTemplate();
  console.log('파일 생성 성공:', fileName);
} catch (error) {
  console.error('파일 생성 실패:', error);
}