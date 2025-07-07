const xlsx = require('xlsx');
const fs = require('fs');

// 테스트용 엑셀 파일 생성
function createTestExcel() {
  const workbook = xlsx.utils.book_new();
  
  // 커리큘럼 데이터
  const data = [
    ['TALEZ 커리큘럼 작성 양식'],
    [''],
    ['제목', '반려동물 재활 전문 과정'],
    ['설명', '반려동물의 재활과 회복을 위한 전문적인 교육 과정입니다.'],
    ['카테고리', '재활훈련'],
    ['전체가격', '400000'],
    [''],
    ['강의 구성'],
    ['회차', '강의명', '설명', '시간(분)', '무료여부', '개별가격'],
    ['1', '재활 기초 평가', '반려동물의 신체 상태 평가 및 재활 계획 수립', '90', 'Y', '0'],
    ['2', '기초 운동치료', '기본적인 물리치료 및 운동요법', '60', 'N', '100000'],
    ['3', '전문 재활 운동', '맞춤형 재활 운동 프로그램', '120', 'N', '150000'],
    ['4', '재활 효과 평가', '재활 진행 상황 평가 및 조정', '90', 'N', '100000'],
    ['5', '가정 관리 교육', '집에서 할 수 있는 관리 방법', '60', 'N', '50000']
  ];
  
  const worksheet = xlsx.utils.aoa_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, '커리큘럼정보');
  
  // 파일 저장
  const fileName = 'public/uploads/test-curriculum-sample.xlsx';
  xlsx.writeFile(workbook, fileName);
  
  console.log('테스트 엑셀 파일 생성 완료:', fileName);
  
  // 파일 읽기 테스트
  try {
    const testWorkbook = xlsx.readFile(fileName);
    const testSheet = testWorkbook.Sheets[testWorkbook.SheetNames[0]];
    const testData = xlsx.utils.sheet_to_json(testSheet, { header: 1, raw: false });
    
    console.log('테스트 파일 읽기 성공:');
    console.log('총 행수:', testData.length);
    for (let i = 0; i < testData.length; i++) {
      if (testData[i] && testData[i].length > 0) {
        console.log('행', i, ':', testData[i]);
      }
    }
    
    return { success: true, data: testData };
  } catch (error) {
    console.error('테스트 파일 읽기 실패:', error.message);
    return { success: false, error: error.message };
  }
}

// 실행
createTestExcel();