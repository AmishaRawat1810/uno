import { io } from 'socket.io-client';

export function createSocket(url) {
  return io(url, {
    transports: ['websocket'],
  });
}
