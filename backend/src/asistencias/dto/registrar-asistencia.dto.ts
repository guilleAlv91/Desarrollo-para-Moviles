import { IsString, IsOptional } from 'class-validator';

export class RegistrarAsistenciaDto {
    @IsString()
    qrData: string;

    @IsOptional()
    @IsString()
    observaciones?: string;
}