import { db } from "../server/db";
import { petFacilities } from "../shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importPetFacilities() {
  try {
    // JSON 파일 읽기
    const filePath = path.join(__dirname, '../attached_assets/pet-facilities-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    console.log(`📥 총 ${data.facilities.length}개의 시설 데이터를 가져왔습니다.`);

    // 기존 데이터 삭제
    await db.delete(petFacilities);
    console.log('🗑️  기존 데이터를 삭제했습니다.');

    // 데이터 삽입
    for (const facility of data.facilities) {
      await db.insert(petFacilities).values({
        name: facility.name,
        type: facility.type,
        latitude: facility.location.lat.toString(),
        longitude: facility.location.lng.toString(),
        address: facility.location.address,
        city: facility.location.city,
        district: facility.location.district,
        phone: facility.contact.phone,
        rating: facility.rating.toString(),
      });
    }

    console.log('✅ 모든 데이터가 성공적으로 삽입되었습니다!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

importPetFacilities();
