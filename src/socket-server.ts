import { createServer, Server } from 'http';
import * as morgan from 'morgan';
import * as express from 'express';
import * as socketIo from 'socket.io';

//could import ts models here

export class SocketServer {
    public static readonly PORT:number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || SocketServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            morgan(':method :url :status :res[content-length] - :response-time ms');
            console.log('running serrver on port %s ', this.port)
        });
        
        this.io.on('connect', (socket:any) => {
            console.log('connected client on port %s. ', this.port);
            socket.on('transmit', (data: any) => {
                console.log('[server](data): %s', JSON.stringify(data));
                this.io.emit('transmit', data);
            });
            this.io.on('button', (n: number) => {
                morgan(JSON.stringify(this));
                console.log('somone just pushed button ', n)
                socket.emit('button1-push', n )
            })
            this.io.on('disconnect', () => {
                console.log('client disconnected');
            });
        });

    }

    public getApp(): express.Application {
        return this.app;
    }
}