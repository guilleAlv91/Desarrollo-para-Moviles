import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { RegistrarAsistenciaDto } from './dto/registrar-asistencia.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Empleado } from '../empleados/entities/empleado.entity';
import { User } from 'src/empleados/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('asistencias')
export class AsistenciasController {
    constructor(private readonly asistenciasService: AsistenciasService) { }

    @Post('fichar')
    registrarMovimiento(
        @User() user: Empleado,
        @Body() dto: RegistrarAsistenciaDto,
    ) {
        return this.asistenciasService.registrarMovimiento(user, dto);
    }

    @Get('hoy')
    getEstadoHoy(@User() user: Empleado) {
        return this.asistenciasService.getEstadoHoy(user.id);
    }

    @Get('historial')
    getHistorial(@User() user: Empleado) {
        return this.asistenciasService.findByEmpleado(user.id);
    }
}

