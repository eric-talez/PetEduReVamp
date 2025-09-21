
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `backups/${timestamp}`;
  
  try {
    // 백업 디렉토리 생성
    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups', { recursive: true });
    }
    
    console.log(`📦 백업 생성 중: ${backupDir}`);
    
    // 중요 파일들 백업
    const filesToBackup = [
      'server/storage.ts',
      'shared/schema.ts',
      '.env.production'
    ];
    
    fs.mkdirSync(backupDir, { recursive: true });
    
    filesToBackup.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        fs.writeFileSync(path.join(backupDir, path.basename(file)), content);
      }
    });
    
    console.log(`✅ 백업 완료: ${backupDir}`);
    
    // 30일 이상된 백업 자동 삭제
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (fs.existsSync('backups')) {
      const backups = fs.readdirSync('backups');
      backups.forEach(backup => {
        const backupPath = path.join('backups', backup);
        const stats = fs.statSync(backupPath);
        if (stats.birthtime < thirtyDaysAgo) {
          fs.rmSync(backupPath, { recursive: true });
          console.log(`🗑️ 오래된 백업 삭제: ${backup}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ 백업 실패:', error.message);
  }
}

// 매일 백업 실행 (Replit에서는 Always On 필요)
setInterval(createBackup, 24 * 60 * 60 * 1000); // 24시간마다

// 즉시 첫 백업 실행
createBackup();
