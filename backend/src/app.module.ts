import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { LicenciasModule } from './licencias/licencias.module';
import { RecibosModule } from './recibos/recibos.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import * as Joi from 'joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().required(),
                DB_USER: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                API_PORT: Joi.number().default(3000),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRES_IN: Joi.string().default('3600s'),
                QR_TEXT: Joi.string().required(),
                OFFICE_LAT: Joi.number().required(),
                OFFICE_LONG: Joi.number().required(),
                MAX_DISTANCE_METERS: Joi.number().default(100),
            }),
            envFilePath: '.env',
        }),
        DatabaseModule,
        AuthModule,
        EmpleadosModule,
        LicenciasModule,
        RecibosModule,
        AsistenciasModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }