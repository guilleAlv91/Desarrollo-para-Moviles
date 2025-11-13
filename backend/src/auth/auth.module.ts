import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { EmpleadosModule } from '../empleados/empleados.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        forwardRef(() => EmpleadosModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn:
                        (configService.get<string>('JWT_EXPIRES_IN') || '1h') as
                        | number
                        | `${number}${'s' | 'm' | 'h' | 'd'}`,
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule { }