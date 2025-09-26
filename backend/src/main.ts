import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());

    const configService = app.get(ConfigService);

    const globalPrefix: string = configService.get('prefix') as string;

    app.setGlobalPrefix(globalPrefix);

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    const swaggerEnabled: boolean = configService.get('swaggerEnabled') as boolean;
    if (swaggerEnabled) {
        const config = new DocumentBuilder()
            .setTitle('Laburo')
            .setDescription('API para gestion laboral')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(globalPrefix, app, document);

    }
    const port: number = configService.get<number>('port') as number;
    await app.listen(port);
}
bootstrap();
