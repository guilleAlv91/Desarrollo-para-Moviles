import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailDto {
    @IsEmail({}, { message: 'El nuevo email debe ser un correo válido' })
    @IsNotEmpty()
    newEmail: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida para cambiar el email' })
    password: string;
}