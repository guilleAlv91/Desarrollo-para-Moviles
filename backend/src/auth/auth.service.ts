import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { EmpleadosService } from '../empleados/empleados.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Empleado } from '../empleados/entities/empleado.entity';
import { Role } from '../empleados/enums/role-enum';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly empleadosService: EmpleadosService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(
        email: string,
        pass: string,
    ): Promise<Partial<Empleado> | null> {
        const user = await this.empleadosService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            message: 'Login exitoso',
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(registerDto: RegisterDto): Promise<Partial<Empleado>> {
        const existingUser = await this.empleadosService.findByEmail(
            registerDto.email,
        );
        if (existingUser) {
            throw new ConflictException('El email ya está en uso');
        }

        const newUser = await this.empleadosService.create({
            ...registerDto,
            role: Role.Empleado,
        });

        const { password, ...result } = newUser;
        return result;
    }

    async changePassword(
        userId: string,
        changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string }> {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.empleadosService.findById(userId, true);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const isPasswordMatching = await bcrypt.compare(
            currentPassword,
            user.password,
        );

        if (!isPasswordMatching) {
            throw new UnauthorizedException('La contraseña actual es incorrecta');
        }

        await this.empleadosService.update(userId, { password: newPassword });

        return { message: 'Contraseña actualizada exitosamente' };
    }

    async changeEmail(
        userId: string,
        changeEmailDto: ChangeEmailDto,
    ): Promise<any> {
        const { newEmail, password } = changeEmailDto;

        const user = await this.empleadosService.findById(userId, true);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('La contraseña es incorrecta');
        }

        if (user.email === newEmail) {
            throw new ConflictException('El nuevo email no puede ser igual al anterior');
        }
        const existingUser = await this.empleadosService.findByEmail(newEmail);
        if (existingUser) {
            throw new ConflictException('El nuevo email ya está en uso');
        }

        const updatedUser = await this.empleadosService.update(userId, {
            email: newEmail,
        });

        const payload = {
            sub: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
        };

        return {
            message:
                'Email actualizado exitosamente',
            access_token: this.jwtService.sign(payload),
            user: updatedUser,
        };
    }
}