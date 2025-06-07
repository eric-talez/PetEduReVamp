
import type { Express, Request, Response } from "express";
import { 
  uploadSingle, 
  uploadMultiple, 
  uploadFields, 
  processUploadedFiles, 
  deleteFile 
} from "../middleware/upload";

export function registerUploadRoutes(app: Express) {
  // 단일 파일 업로드
  app.post("/api/upload/single", (req: Request, res: Response) => {
    uploadSingle(req, res, (err) => {
      if (err) {
        console.error('업로드 오류:', err);
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: '업로드할 파일이 없습니다.' 
        });
      }

      const fileInfo = processUploadedFiles(req.file);
      res.json({ 
        success: true, 
        file: fileInfo,
        message: '파일이 성공적으로 업로드되었습니다.'
      });
    });
  });

  // 다중 파일 업로드
  app.post("/api/upload/multiple", (req: Request, res: Response) => {
    uploadMultiple(req, res, (err) => {
      if (err) {
        console.error('업로드 오류:', err);
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }

      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({ 
          success: false, 
          message: '업로드할 파일이 없습니다.' 
        });
      }

      const filesInfo = processUploadedFiles(req.files);
      res.json({ 
        success: true, 
        files: filesInfo,
        message: `${Array.isArray(filesInfo) ? filesInfo.length : 0}개 파일이 성공적으로 업로드되었습니다.`
      });
    });
  });

  // 필드별 파일 업로드 (알림장용)
  app.post("/api/upload/notebook", (req: Request, res: Response) => {
    uploadFields(req, res, (err) => {
      if (err) {
        console.error('업로드 오류:', err);
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }

      const filesInfo = processUploadedFiles(req.files);
      res.json({ 
        success: true, 
        files: filesInfo,
        message: '알림장 파일들이 성공적으로 업로드되었습니다.'
      });
    });
  });

  // 프로필 사진 업로드
  app.post("/api/upload/avatar", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: '로그인이 필요합니다.' 
      });
    }

    uploadSingle(req, res, async (err) => {
      if (err) {
        console.error('프로필 사진 업로드 오류:', err);
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: '업로드할 이미지가 없습니다.' 
        });
      }

      try {
        const fileInfo = processUploadedFiles(req.file);
        const userId = req.user!.id;

        // 사용자 프로필에 아바타 URL 업데이트
        const { storage } = await import("../storage");
        await storage.updateUserProfile(userId, {
          avatar: fileInfo!.url
        });

        res.json({ 
          success: true, 
          file: fileInfo,
          message: '프로필 사진이 성공적으로 업데이트되었습니다.'
        });
      } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        res.status(500).json({ 
          success: false, 
          message: '프로필 업데이트 중 오류가 발생했습니다.' 
        });
      }
    });
  });

  // 파일 삭제
  app.delete("/api/upload/:filename", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: '로그인이 필요합니다.' 
      });
    }

    const { filename } = req.params;
    const success = deleteFile(filename);

    if (success) {
      res.json({ 
        success: true, 
        message: '파일이 성공적으로 삭제되었습니다.' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: '파일을 찾을 수 없거나 삭제할 수 없습니다.' 
      });
    }
  });

  // 업로드된 파일 목록 조회
  app.get("/api/upload/files", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: '로그인이 필요합니다.' 
      });
    }

    // 실제 구현에서는 데이터베이스에서 사용자별 파일 목록을 조회
    res.json({ 
      success: true, 
      files: [],
      message: '파일 목록을 불러왔습니다.' 
    });
  });
}
