import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    fullName: string;

    @MinLength(6)
    password: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;
}
