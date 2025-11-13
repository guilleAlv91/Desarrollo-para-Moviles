import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Empleado } from '../empleados/entities/empleado.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { User } from 'src/empleados/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<Partial<Empleado>> {
        return this.authService.register(registerDto);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @User() user: Empleado,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(user.id, changePasswordDto);
    }

    @Post('change-email')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async changeEmail(
        @User() user: Empleado,
        @Body() changeEmailDto: ChangeEmailDto,
    ) {
        return this.authService.changeEmail(user.id, changeEmailDto);
    }
}