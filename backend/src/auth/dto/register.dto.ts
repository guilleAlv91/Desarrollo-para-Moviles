import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    IsDate,
} from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'El email debe ser un correo válido' })
    @IsNotEmpty({ message: 'El email no puede estar vacío' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @MinLength(8, {
        message: 'La contraseña debe tener al menos 8 caracteres',
    })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
    apellido: string;

    @IsString()
    @IsOptional()
    telefono?: string;

    @IsString()
    @IsOptional()
    direccion?: string;

    @IsDate()
    @IsOptional()
    fechaContratacion?: Date;
}