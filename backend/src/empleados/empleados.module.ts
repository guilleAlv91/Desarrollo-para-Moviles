import { forwardRef, Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { AuthModule } from '../auth/auth.module';

@Module({

    imports: [
        TypeOrmModule.forFeature([Empleado]),
        forwardRef(() => AuthModule),
    ],
    controllers: [EmpleadosController],
    providers: [EmpleadosService],
    exports: [EmpleadosService, TypeOrmModule],
})
export class EmpleadosModule { }