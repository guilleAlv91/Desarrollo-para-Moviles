import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class RegistrarAsistenciaDto {
    @IsString()
    qrData: string;

    @IsNumber()
    @IsNotEmpty()
    latitud: number;

    @IsNumber()
    @IsNotEmpty()
    longitud: number;

    @IsOptional()
    @IsString()
    observaciones?: string;
}