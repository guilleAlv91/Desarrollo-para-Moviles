import { Module } from '@nestjs/common';
import { LicenciasService } from './licencias.service';
import { LicenciasController } from './licencias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Licencia } from './entities/licencia.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Licencia]), AuthModule],
    controllers: [LicenciasController],
    providers: [LicenciasService],
})
export class LicenciasModule { }