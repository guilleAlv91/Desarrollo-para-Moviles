import {
    IsInt,
    IsNotEmpty,
    IsString,
    IsUrl,
    Max,
    Min,
    IsUUID,
} from 'class-validator';

export class CreateReciboDto {
    @IsInt()
    @Min(1)
    @Max(12)
    @IsNotEmpty()
    mes: number;

    @IsInt()
    @Min(2000)
    @IsNotEmpty()
    anio: number;

    @IsUrl()
    @IsNotEmpty()
    urlArchivo: string;

    @IsUUID()
    @IsNotEmpty()
    empleadoId: string;
}