import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { EstadoLicencia, TipoLicencia } from '../entities/licencia.entity';

export class CreateLicenciaDto {
    @IsEnum(TipoLicencia)
    @IsNotEmpty()
    tipo: TipoLicencia;

    @IsDate()
    @IsNotEmpty()
    fechaInicio: Date;

    @IsDate()
    @IsNotEmpty()
    fechaFin: Date;

    @IsString()
    @IsOptional()
    motivo?: string;
}

export class UpdateLicenciaEstadoDto {
    @IsEnum(EstadoLicencia)
    @IsNotEmpty()
    estado: EstadoLicencia;

    @IsString()
    @IsOptional()
    comentarioAdmin?: string;
}