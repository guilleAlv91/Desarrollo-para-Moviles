import { Module } from '@nestjs/common';
import { RecibosService } from './recibos.service';
import { RecibosController } from './recibos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recibo } from './entities/recibo.entity';
import { AuthModule } from '../auth/auth.module';
import { EmpleadosModule } from '../empleados/empleados.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Recibo]),
        AuthModule,
        EmpleadosModule,
    ],
    controllers: [RecibosController],
    providers: [RecibosService],
})
export class RecibosModule { }