import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencias.controller';
import { Asistencia } from './entities/asistencia.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Asistencia]), AuthModule],
    controllers: [AsistenciasController],
    providers: [AsistenciasService],
})
export class AsistenciasModule { }