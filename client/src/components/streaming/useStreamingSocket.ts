import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface PeerInfo {
  peerId: string;
  streamId: number;
  userId?: number;
  userName?: string;
  role: 'host' | 'viewer';
  connectionQuality: 'good' | 'fair' | 'poor';
}

interface SignalData {
  type: 'offer' | 'answer' | 'candidate';
  sdp?: string;
  candidate?: RTCIceCandidateInit;
  from: string;
  to: string;
  streamId: number;
}

interface ChatMessage {
  id: number;
  streamId: number;
  userId: number;
  message: string;
  userName?: string;
  userAvatar?: string;
  createdAt: Date;
}

interface StreamJoinedData {
  streamId: number;
  peers: PeerInfo[];
  isHost: boolean;
}

interface PeerJoinedData {
  peerId: string;
  userId?: number;
  userName?: string;
  role: 'host' | 'viewer';
}

interface PeerLeftData {
  peerId: string;
  userId?: number;
}

interface StreamEndedData {
  streamId: number;
  reason: string;
}

interface UseStreamingSocketOptions {
  onStreamJoined?: (data: StreamJoinedData) => void;
  onPeerJoined?: (data: PeerJoinedData) => void;
  onPeerLeft?: (data: PeerLeftData) => void;
  onSignal?: (data: SignalData) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onStreamEnded?: (data: StreamEndedData) => void;
  onError?: (error: { message: string }) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function useStreamingSocket(options: UseStreamingSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('[StreamingSocket] Already connected');
      return;
    }

    console.log('[StreamingSocket] Attempting to connect to /streaming namespace');
    
    const socket = io('/streaming', {
      path: '/streaming-socket',
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
    });

    socket.on('connect', () => {
      console.log('[StreamingSocket] Connected! Socket ID:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttemptsRef.current = 0;
      options.onConnectionChange?.(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[StreamingSocket] Disconnected:', reason);
      setIsConnected(false);
      options.onConnectionChange?.(false);
      
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('[StreamingSocket] Connection error:', error.message);
      reconnectAttemptsRef.current += 1;
      setConnectionError(`Connection error: ${error.message}`);
      
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        options.onError?.({ message: 'Failed to connect after multiple attempts' });
      }
    });

    socket.on('stream-joined', (data: StreamJoinedData) => {
      options.onStreamJoined?.(data);
    });

    socket.on('peer-joined', (data: PeerJoinedData) => {
      options.onPeerJoined?.(data);
    });

    socket.on('peer-left', (data: PeerLeftData) => {
      options.onPeerLeft?.(data);
    });

    socket.on('signal', (data: SignalData) => {
      options.onSignal?.(data);
    });

    socket.on('new-chat-message', (message: ChatMessage) => {
      options.onChatMessage?.(message);
    });

    socket.on('stream-ended', (data: StreamEndedData) => {
      options.onStreamEnded?.(data);
    });

    socket.on('error', (error: { message: string }) => {
      setConnectionError(error.message);
      options.onError?.(error);
    });

    socketRef.current = socket;
  }, [options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const joinStream = useCallback((streamId: number, userId?: number, role: 'host' | 'viewer' = 'viewer') => {
    if (!socketRef.current?.connected) {
      options.onError?.({ message: 'Socket not connected' });
      return;
    }

    socketRef.current.emit('join-stream', {
      streamId,
      userId,
      role,
      sessionId: sessionIdRef.current,
    });
  }, [options]);

  const leaveStream = useCallback((streamId: number) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('leave-stream', {
      streamId,
      sessionId: sessionIdRef.current,
    });
  }, []);

  const sendSignal = useCallback((signalData: Omit<SignalData, 'from'>) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('signal', signalData);
  }, []);

  const sendChatMessage = useCallback((streamId: number, userId: number, message: string) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('chat-message', {
      streamId,
      userId,
      message,
    });
  }, []);

  const updateQuality = useCallback((quality: 'good' | 'fair' | 'poor') => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('update-quality', quality);
  }, []);

  const endStream = useCallback((streamId: number) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('end-stream', { streamId });
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    sessionId: sessionIdRef.current,
    connect,
    disconnect,
    joinStream,
    leaveStream,
    sendSignal,
    sendChatMessage,
    updateQuality,
    endStream,
  };
}

export type { 
  PeerInfo, 
  SignalData, 
  ChatMessage, 
  StreamJoinedData, 
  PeerJoinedData, 
  PeerLeftData, 
  StreamEndedData 
};
