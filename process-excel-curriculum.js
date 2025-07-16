import XLSX from 'xlsx';
import fs from 'fs';

// 엑셀 파일 읽기
const workbook = XLSX.readFile('/home/runner/workspace/attached_assets/반려동물_재활_커리큘럼_정리_1751901579693.xlsx');

// 모든 시트 이름 출력
console.log('시트 이름들:', workbook.SheetNames);

// 각 시트의 데이터 확인
workbook.SheetNames.forEach((sheetName, index) => {
  console.log(`\n=== 시트 ${index + 1}: ${sheetName} ===`);
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('데이터 행 수:', data.length);
  console.log('첫 5행:');
  data.slice(0, 5).forEach((row, i) => {
    console.log(`행 ${i + 1}:`, row);
  });
});

// 첫 번째 시트의 JSON 데이터 생성
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(firstSheet);
console.log('\n=== JSON 형태 데이터 ===');
console.log(JSON.stringify(jsonData, null, 2));