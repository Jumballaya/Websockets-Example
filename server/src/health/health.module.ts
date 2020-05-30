import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [
        HealthController
    ],
})
export class HealthModule { }
