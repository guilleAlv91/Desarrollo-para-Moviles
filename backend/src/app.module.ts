import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            ignoreEnvFile: process.env.NODE_ENV === 'production'
        })
    ],
})
export class AppModule { }
