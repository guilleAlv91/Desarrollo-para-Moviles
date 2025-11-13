import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Req,
    ParseUUIDPipe,
} from '@nestjs/common';
import { RecibosService } from './recibos.service';
import { CreateReciboDto } from './dto/create-recibo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../empleados/enums/role-enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Empleado } from '../empleados/entities/empleado.entity';
import { User } from 'src/empleados/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('recibos')
export class RecibosController {
    constructor(private readonly recibosService: RecibosService) { }

    /**
     * (ADMIN) Carga un nuevo recibo de sueldo para un empleado
     */
    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    create(@Body() createReciboDto: CreateReciboDto) {
        // Aquí iría la lógica para subir el archivo (ej. a S3) y obtener la URL
        // Por ahora, asumimos que la URL ya viene en el DTO.
        return this.recibosService.create(createReciboDto);
    }

    /**
     * (EMPLEADO) Obtiene sus propios recibos de sueldo
     */
    @Get('mis-recibos')
    findMyRecibos(@User() empleado: Empleado,) {
        return this.recibosService.findByEmpleado(empleado.id);
    }

    /**
     * (ADMIN) Obtiene los recibos de un empleado específico
     */
    @Get('por-empleado/:empleadoId')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    findByEmpleado(@Param('empleadoId', ParseUUIDPipe) empleadoId: string) {
        return this.recibosService.findByEmpleado(empleadoId);
    }
}