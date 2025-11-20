import { NestFactory } from '@nestjs/core';
import { EmpleadosService } from '../empleados/empleados.service';
import { AppModule } from '../app.module';
import { SEED_EMPLEADOS } from './data/seed-data';
import { DataSource } from 'typeorm';
import { Asistencia } from '../asistencias/entities/asistencia.entity';

const restarDias = (dias: number): Date => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
};

const formatFecha = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const empleadosService = app.get(EmpleadosService);

    const dataSource = app.get(DataSource);
    const asistenciaRepo = dataSource.getRepository(Asistencia);

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
            console.error(`Error creando empleado ${empleadoData.email}:`, error.message);
        }
    }

    const emailUsuarioTarget = SEED_EMPLEADOS[0].email;
    const empleado = await empleadosService.findByEmail(emailUsuarioTarget);

    if (empleado) {
        const historialExistente = await asistenciaRepo.count({
            where: { empleado: { id: empleado.id } }
        });

        if (historialExistente === 0) {
            const diasSimulados = [
                { diasAtras: 3, ingreso: '09:00', egreso: '18:00' },
                { diasAtras: 2, ingreso: '09:15', egreso: '18:10' },
                { diasAtras: 1, ingreso: '08:55', egreso: '18:00' },
            ];

            for (const dato of diasSimulados) {
                const fechaSimulada = restarDias(dato.diasAtras);
                const fechaString = formatFecha(fechaSimulada);

                const nuevaAsistencia = asistenciaRepo.create({
                    fecha: fechaString,
                    horaIngreso: dato.ingreso,
                    horaEgreso: dato.egreso,
                    // observaciones: 'Carga automática Seed',
                    empleado: empleado,
                    createdAt: fechaSimulada,
                    updatedAt: fechaSimulada,
                });

                await asistenciaRepo.save(nuevaAsistencia);
            }
        } else {
            console.log('El empleado ya tiene historial');
        }
    } else {
        console.error('No se pudo cargar historial.');
    }
    await app.close();
}

bootstrap().catch((err) => {
    console.error('Error al crear datos:', err);
    process.exit(1);
});