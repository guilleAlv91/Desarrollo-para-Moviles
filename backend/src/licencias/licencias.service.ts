import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Licencia, EstadoLicencia } from './entities/licencia.entity';
import { Repository } from 'typeorm';
import { CreateLicenciaDto, UpdateLicenciaEstadoDto } from './dto/create-licencia.dto';
import { Empleado } from '../empleados/entities/empleado.entity';

@Injectable()
export class LicenciasService {
    constructor(
        @InjectRepository(Licencia)
        private readonly licenciaRepository: Repository<Licencia>,
    ) { }

    async create(
        createLicenciaDto: CreateLicenciaDto,
        empleado: Empleado,
    ): Promise<Licencia> {
        const newLicencia = this.licenciaRepository.create({
            ...createLicenciaDto,
            empleado: empleado,
        });
        return this.licenciaRepository.save(newLicencia);
    }

    async findAll(): Promise<Licencia[]> {
        return this.licenciaRepository.find({ relations: ['empleado'] });
    }

    async findByEmpleado(empleadoId: string): Promise<Licencia[]> {
        return this.licenciaRepository.find({
            where: { empleado: { id: empleadoId } },
            order: { fechaInicio: 'DESC' },
        });
    }

    async updateEstado(
        id: string,
        updateDto: UpdateLicenciaEstadoDto,
    ): Promise<Licencia> {
        const licencia = await this.licenciaRepository.findOneBy({ id });
        if (!licencia) {
            throw new NotFoundException('Licencia no encontrada');
        }

        licencia.estado = updateDto.estado;
        licencia.comentarioAdmin = updateDto.comentarioAdmin ?? "";


        return this.licenciaRepository.save(licencia);
    }

    async remove(id: string, empleadoId: string): Promise<{ message: string }> {
        const licencia = await this.licenciaRepository.findOne({
            where: { id },
            relations: ['empleado'],
        });

        if (!licencia) {
            throw new NotFoundException('Licencia no encontrada');
        }

        if (licencia.empleado.id !== empleadoId) {
            throw new ForbiddenException('No tienes permiso para borrar esta licencia');
        }

        if (licencia.estado !== EstadoLicencia.PENDIENTE) {
            throw new ForbiddenException(
                'No se puede borrar una licencia que ya ha sido procesada',
            );
        }

        await this.licenciaRepository.delete(id);
        return { message: 'Solicitud de licencia eliminada' };
    }
}