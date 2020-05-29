import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis';
import { Socket, Server } from 'socket.io';


@WebSocketGateway()
export class CursorSocketGateway implements OnGatewayDisconnect {

    @WebSocketServer() wss: Server;

    constructor(
        private readonly redisService: RedisService,
    ) { }

    async addEntry(entry: { color: string, id: string }): Promise<"OK"> {
        const client = await this.redisService.getClient();
        return client.set(entry.id, [JSON.stringify(entry)]);
    }

    async updateEntry(entry: { color: string, id: string, x: string, y: string }) {
        const client = await this.redisService.getClient();
        client.set(entry.id, [JSON.stringify(entry)]);
    }

    async getEntries() {
        const client = this.redisService.getClient();
        const keys = await client.keys('*');
        return Promise.all(keys.map(k => {
            return client.get(k);
        }));
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        const id = socket.id;
        const client = await this.redisService.getClient();
        await client.del(id);

        const cursors = await this.getEntries();
        this.wss.emit('new-positions', cursors);
    }

    genColor(): string {
        // Create 3 random numbers between 0 - 255 (0x00 - 0xff)
        // Convert decimal to a hex string
        // Join the hex strings with a '#' sign in front to get the 6-digit hex value, e.g. '#abc123'
        return '#' + Array.from(new Array(3))
            .map(() => Math.floor(Math.random() * 255))
            .map(d => d.toString(16).padStart(2, '0'))
            .join('');
    }

    @SubscribeMessage('enter')
    async handleEnter(
        @ConnectedSocket() socket: Socket,
    ) {
        // 1. Generate ID
        const id = socket.id;

        // 2. Generate Color
        const color = this.genColor();

        // 3. Add entry to redis
        const entry = {
            color,
            id,
        };
        await this.addEntry(entry);

        // 4. Return entry to client
        return entry;
    }

    @SubscribeMessage('update-position')
    async handlePositionEvent(@MessageBody() data: any) {
        // 1. Update entry in redis
        await this.updateEntry(data);

        // 2. Get all the cursors
        const cursors = await this.getEntries();

        this.wss.emit('new-positions', cursors);
    }

}