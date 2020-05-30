import io from 'socket.io-client';
import { config } from './config';

export class SocketController {
    socket: SocketIOClient.Socket;
    id: string;
    color: string;
    cursors: any[];

    constructor() {
        this.socket = io(config.api.base, { transports: ['websocket'], upgrade: false });
        this.socket.on('connect', this.connect.bind(this));
    }

    updatePosition(x: number, y: number) {
        const data = { x, y, id: this.id, color: this.color };
        this.socket.emit('update-position', data);
    }

    subscribe(cb: (i: any[]) => void) {
        this.socket.addEventListener('new-positions', (data) => {
            cb(data.map(d => JSON.parse(d)));
        });
    }

    private connect() {
        this.socket.emit('enter', {}, (data) => {
            this.id = data.id;
            this.color = data.color;
        });
    }

}