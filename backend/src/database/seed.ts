import { NestFactory } from '@nestjs/core';
import { EmpleadosService } from '../empleados/empleados.service';
import { AppModule } from '../app.module';
import { SEED_EMPLEADOS } from './data/seed-data';
import { Role } from 'src/empleados/enums/role-enum';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const empleadosService = app.get(EmpleadosService);

    console.log('Iniciando el proceso de seeding...');

    // Limpiar datos existentes
    // await empleadosService.removeAll();

    for (const empleadoData of SEED_EMPLEADOS) {
        try {
            const existe = await empleadosService.findByEmail(empleadoData.email);
            if (!existe) {
                console.log(`Creando empleado: ${empleadoData.email}`);
                await empleadosService.create(empleadoData as any);
            } else {
                console.log(`Empleado ya existe: ${empleadoData.email}`);
            }
        } catch (error) {
            console.error(
                `Error creando empleado ${empleadoData.email}:`,
                error.message,
            );
        }
    }

    console.log('Seeding completado.');
    await app.close();
}

bootstrap().catch((err) => {
    console.error('Error durante el seeding:', err);
    process.exit(1);
});