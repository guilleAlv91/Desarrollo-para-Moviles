import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
    ClassSerializerInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/role-enum';
import { Empleado } from './entities/empleado.entity';
import { User } from './decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('empleados')
export class EmpleadosController {
    constructor(private readonly empleadosService: EmpleadosService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
        return this.empleadosService.create(createEmpleadoDto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    findAll() {
        return this.empleadosService.findAll();
    }

    @Get('me')
    getProfile(@User() user: Empleado) {
        return user;
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.empleadosService.findById(id);
    }

    @Patch('me')
    updateOwnProfile(
        @User() user: Empleado,
        @Body() updateEmpleadoDto: UpdateEmpleadoDto,
    ) {
        // Un empleado no puede cambiar su propio rol. Email y contraseña cambian por otra ruta)
        delete updateEmpleadoDto.role;
        delete updateEmpleadoDto.email;
        delete updateEmpleadoDto.password;
        return this.empleadosService.update(user.id, updateEmpleadoDto);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateEmpleadoDto: UpdateEmpleadoDto,
    ) {
        return this.empleadosService.update(id, updateEmpleadoDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.empleadosService.remove(id);
    }
}