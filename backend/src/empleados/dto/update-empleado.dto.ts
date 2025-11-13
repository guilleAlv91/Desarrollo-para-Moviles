import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { Role } from '../enums/role-enum';

// PartialType hace que todos los campos de CreateEmpleadoDto sean opcionales
export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {
    // Sobrescribimos campos para validación específica de actualización si es necesario
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(8)
    @IsOptional()
    password?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}