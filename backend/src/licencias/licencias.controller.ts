import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    ParseUUIDPipe,
} from '@nestjs/common';
import { LicenciasService } from './licencias.service';
import { CreateLicenciaDto, UpdateLicenciaEstadoDto } from './dto/create-licencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/empleados/enums/role-enum';
import { Empleado } from '../empleados/entities/empleado.entity';
import { User } from 'src/empleados/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('licencias')
export class LicenciasController {
    constructor(private readonly licenciasService: LicenciasService) { }

    @Post()
    create(@Body() createLicenciaDto: CreateLicenciaDto, @User() empleado: Empleado,) {
        return this.licenciasService.create(createLicenciaDto, empleado);
    }

    @Get('mis-licencias')
    findMyLicencias(@User() empleado: Empleado,) {
        return this.licenciasService.findByEmpleado(empleado.id);
    }

    @Get('admin/todas')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    findAll() {
        return this.licenciasService.findAll();
    }

    @Patch('admin/actualizar-estado/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    updateEstado(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateLicenciaEstadoDto,
    ) {
        return this.licenciasService.updateEstado(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string, @User() empleado: Empleado,) {
        return this.licenciasService.remove(id, empleado.id);
    }
}