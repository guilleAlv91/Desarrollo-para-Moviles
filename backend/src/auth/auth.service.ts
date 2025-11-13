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
import { Role } from 'src/empleados/enums/role-enum';

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
}