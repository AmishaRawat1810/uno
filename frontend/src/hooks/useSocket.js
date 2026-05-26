import { useEffect, useMemo, useRef, useState } from 'react';
import { createSocket } from '../socket.js';

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const defaultApiUrl = isLocalhost ? 'http://localhost:4000' : `${window.location.protocol}//${window.location.host}`;
const API_URL = defaultApiUrl;

export default function useSocket() {
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const socketInstance = createSocket(API_URL);
    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      setSocketId(socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('connect_error', (error) => {
      setNotification(`Socket error: ${error.message}`);
      setConnected(false);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    socketInstance.on('room_updated', (data) => {
      setRoomState(data);
    });

    socketInstance.on('invalid_move', (data) => {
      setNotification(data.message || 'Invalid move');
    });

    socketInstance.on('player_joined', (data) => {
      setNotification(`${data.playerName} joined the room`);
    });

    socketInstance.on('player_left', () => {
      setNotification('A player left the room');
    });

    socketInstance.on('player_won', () => {
      setNotification('A player has won the game');
    });

    socketInstance.on('game_started', () => {
      setNotification('Game started');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const emit = (event, payload, callback) => {
    const socketInstance = socketRef.current;
    if (!socketInstance) {
      if (callback) callback({ success: false, message: 'Socket is not connected' });
      return;
    }
    socketInstance.emit(event, payload, (result) => {
      if (callback) callback(result);
    });
  };

  const createRoom = (playerName, callback) => {
    emit('create_room', { playerName }, callback);
  };

  const joinRoom = (roomId, playerName, callback) => {
    emit('join_room', { roomId, playerName }, callback);
  };

  const startGame = (roomId, callback) => {
    emit('start_game', { roomId }, callback);
  };

  const playCard = (roomId, cardId, chosenColor, callback) => {
    emit('play_card', { roomId, cardId, chosenColor }, callback);
  };

  const drawCard = (roomId, callback) => {
    emit('draw_card', { roomId }, callback);
  };

  const sayUno = (roomId, callback) => {
    emit('say_uno', { roomId }, callback);
  };

  const leaveRoom = (roomId, callback) => {
    emit('leave_room', { roomId }, callback);
    setRoomState(null);
  };

  const status = useMemo(
    () => ({ connected, socketId, roomState }),
    [connected, socketId, roomState]
  );

  return {
    ...status,
    notification,
    createRoom,
    joinRoom,
    startGame,
    playCard,
    drawCard,
    sayUno,
    leaveRoom,
  };
}
