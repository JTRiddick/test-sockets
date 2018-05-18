import { SocketServer } from './socket-server';

let app = new SocketServer().getApp();
export { app };