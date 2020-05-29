import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
import { CursorSocketGateway } from "./websocket/websocket.gateway";
import { config } from './config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.get('redis'),
            inject: [ConfigService],
        }),
    ],
    providers: [CursorSocketGateway],
})
export class AppModule { }
