/**
 * WebSocket 서버 핸들러
 * 
 * WebSocket 연결을 관리하고 사용자 인증, 메시지 처리, 알림 등을 담당합니다.
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { registerWebSocketClient } from './routes/notification-routes';
import { parse } from 'url';

// 메시지 타입 정의
interface WebSocketMessage {
  type: string;
  data?: any;
}

// 커넥션 관리
interface Connection {
  userId?: number;
  socket: WebSocket;
  isAuthenticated: boolean;
}

// WebSocket 핸들러 클래스
export class WebSocketHandler {
  private wss: WebSocketServer;
  private connections: Map<WebSocket, Connection> = new Map();
  
  constructor(server: Server) {
    // WebSocket 서버 생성
    this.wss = new WebSocketServer({
      server,
      path: '/ws' // WebSocket 연결 경로
    });
    
    this.setupWebSocketServer();
    console.log('[WebSocketHandler] WebSocket 서버 초기화 완료 (경로: /ws)');
  }
  
  private setupWebSocketServer() {
    // 연결 이벤트 처리
    this.wss.on('connection', (socket: WebSocket, request) => {
      console.log('[WebSocketHandler] 새 WebSocket 연결');
      
      // 새 연결 저장
      this.connections.set(socket, { 
        socket, 
        isAuthenticated: false
      });
      
      // 소켓이 닫힐 때 연결 제거
      socket.on('close', () => {
        this.connections.delete(socket);
        console.log('[WebSocketHandler] WebSocket 연결 종료');
      });
      
      // 메시지 처리
      socket.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString()) as WebSocketMessage;
          this.handleMessage(socket, message);
        } catch (error) {
          console.error('[WebSocketHandler] 메시지 파싱 오류:', error);
          this.sendError(socket, 'invalid_message', '잘못된 메시지 형식입니다.');
        }
      });
      
      // 오류 처리
      socket.on('error', (error) => {
        console.error('[WebSocketHandler] WebSocket 오류:', error);
        this.connections.delete(socket);
      });
      
      // 연결 설정 완료 메시지 전송
      this.sendToSocket(socket, {
        type: 'connection_established',
        data: { 
          timestamp: new Date().toISOString(),
          message: 'WebSocket 연결이 설정되었습니다. 인증이 필요합니다.'
        }
      });
    });
  }
  
  private handleMessage(socket: WebSocket, message: WebSocketMessage) {
    const connection = this.connections.get(socket);
    
    if (!connection) {
      console.error('[WebSocketHandler] 연결을 찾을 수 없습니다.');
      return;
    }
    
    switch (message.type) {
      case 'authenticate':
        this.handleAuthentication(connection, message.data);
        break;
        
      case 'heartbeat':
        this.handleHeartbeat(connection);
        break;
        
      case 'chat_message':
        if (!connection.isAuthenticated) {
          this.sendError(socket, 'auth_required', '인증이 필요합니다.');
          return;
        }
        // 채팅 메시지 처리 로직 (메시징 서비스로 전달)
        break;
        
      default:
        console.warn(`[WebSocketHandler] 알 수 없는 메시지 타입: ${message.type}`);
        this.sendError(socket, 'unknown_message_type', '알 수 없는 메시지 타입입니다.');
    }
  }
  
  private handleAuthentication(connection: Connection, data: any) {
    // 인증 토큰 확인 (세션 ID 또는 JWT 등을 사용할 수 있음)
    if (!data || !data.token || !data.userId) {
      this.sendError(connection.socket, 'invalid_auth', '유효하지 않은 인증 정보입니다.');
      return;
    }
    
    // 실제 구현에서는 토큰의 유효성을 검증해야 함
    // 여기서는 간단히 토큰이 있으면 인증 성공으로 처리
    const userId = parseInt(data.userId);
    
    connection.userId = userId;
    connection.isAuthenticated = true;
    
    // 알림 서비스에 클라이언트 등록
    registerWebSocketClient(userId, connection.socket);
    
    this.sendToSocket(connection.socket, {
      type: 'auth_success',
      data: { 
        userId,
        timestamp: new Date().toISOString() 
      }
    });
    
    console.log(`[WebSocketHandler] 사용자 ${userId} 인증 성공`);
  }
  
  private handleHeartbeat(connection: Connection) {
    this.sendToSocket(connection.socket, {
      type: 'heartbeat_response',
      data: { timestamp: new Date().toISOString() }
    });
  }
  
  private sendToSocket(socket: WebSocket, message: any) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }
  
  private sendError(socket: WebSocket, code: string, message: string) {
    this.sendToSocket(socket, {
      type: 'error',
      data: {
        code,
        message,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  /**
   * 특정 사용자에게 메시지를 전송합니다.
   */
  public sendToUser(userId: number, message: any) {
    let sentCount = 0;
    
    // 해당 사용자의 모든 연결에 메시지 전송
    for (const [, connection] of this.connections.entries()) {
      if (connection.isAuthenticated && connection.userId === userId) {
        this.sendToSocket(connection.socket, message);
        sentCount++;
      }
    }
    
    return sentCount;
  }
  
  /**
   * 모든 인증된 사용자에게 메시지를 전송합니다.
   */
  public broadcast(message: any, exceptUserId?: number) {
    let sentCount = 0;
    
    // 모든 인증된 연결에 메시지 전송
    for (const [, connection] of this.connections.entries()) {
      if (connection.isAuthenticated && 
          (exceptUserId === undefined || connection.userId !== exceptUserId)) {
        this.sendToSocket(connection.socket, message);
        sentCount++;
      }
    }
    
    return sentCount;
  }
}