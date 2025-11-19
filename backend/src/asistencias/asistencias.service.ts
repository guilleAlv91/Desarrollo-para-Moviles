import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Empleado } from '../empleados/entities/empleado.entity';
import { RegistrarAsistenciaDto } from './dto/registrar-asistencia.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AsistenciasService {
    constructor(
        @InjectRepository(Asistencia)
        private readonly asistenciaRepository: Repository<Asistencia>,
        private readonly configService: ConfigService,
    ) { }

    private getTodayString(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private getCurrentTime(): string {
        const now = new Date();
        const hh = now.getHours().toString().padStart(2, '0');
        const mm = now.getMinutes().toString().padStart(2, '0');
        return `${hh}:${mm}`;
    }

    async registrarIngreso(
        empleado: Empleado,
        dto: RegistrarAsistenciaDto,
    ): Promise<Asistencia> {
        const hoy = this.getTodayString();

        // const ingresado = await this.asistenciaRepository.findOne({
        //     where: {
        //         empleado: { id: empleado.id },
        //         fecha: hoy,
        //     },
        // });

        // if (ingresado) {
        //     throw new BadRequestException('Ya registraste tu ingreso el día de hoy');
        // }

        const asistencia = this.asistenciaRepository.create({
            fecha: hoy,
            horaIngreso: this.getCurrentTime(),
            observaciones: dto.observaciones,
            empleado: empleado,
        });

        return this.asistenciaRepository.save(asistencia);
    }

    async registrarEgreso(
        empleado: Empleado,
        dto: RegistrarAsistenciaDto,
    ): Promise<Asistencia> {
        const hoy = this.getTodayString();

        const asistencia = await this.asistenciaRepository.findOne({
            where: {
                empleado: { id: empleado.id },
                fecha: hoy,
            },
        });

        if (!asistencia) {
            throw new BadRequestException('No registraste ingreso el día de hoy');
        }

        if (asistencia.horaEgreso) {
            throw new BadRequestException('Ya registraste tu salida el día de hoy');
        }

        asistencia.horaEgreso = this.getCurrentTime();
        if (dto.observaciones) {
            asistencia.observaciones = asistencia.observaciones
                ? `${asistencia.observaciones} | Salida: ${dto.observaciones}`
                : `Salida: ${dto.observaciones}`;
        }

        return this.asistenciaRepository.save(asistencia);
    }

    async registrarMovimiento(
        empleado: Empleado,
        dto: RegistrarAsistenciaDto,
    ): Promise<Asistencia> {
        const qrValido = this.configService.get<string>('QR_TEXT');

        if (dto.qrData !== qrValido) {
            // if (dto.qrData !== 'LABURO_SEDE_PRINCIPAL_ENTRADA_UUID_842a') {
            throw new BadRequestException('Código QR invalido');
        }

        const estadoActual = await this.getEstadoHoy(empleado.id);

        if (estadoActual.estado === 'pendiente_ingreso') {
            return this.registrarIngreso(empleado, dto);
        }

        if (estadoActual.estado === 'trabajando') {
            return this.registrarEgreso(empleado, dto);
        }

        throw new BadRequestException('Ya no es posible registrar movimientos por hoy');
    }

    async getEstadoHoy(empleadoId: string) {
        const hoy = this.getTodayString();
        const asistencia = await this.asistenciaRepository.findOne({
            where: { empleado: { id: empleadoId }, fecha: hoy },
        });

        if (!asistencia) return { estado: 'pendiente_ingreso' };
        if (!asistencia.horaEgreso) return { estado: 'trabajando', asistencia };
        return { estado: 'jornada_finalizada', asistencia };
    }

    async findByEmpleado(empleadoId: string) {
        return this.asistenciaRepository.find({
            where: { empleado: { id: empleadoId } },
            order: { fecha: 'DESC' },
        });
    }
}