import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReciboDto } from './dto/create-recibo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recibo } from './entities/recibo.entity';
import { Repository } from 'typeorm';
import { EmpleadosService } from '../empleados/empleados.service';

@Injectable()
export class RecibosService {
    constructor(
        @InjectRepository(Recibo)
        private readonly reciboRepository: Repository<Recibo>,
        private readonly empleadosService: EmpleadosService,
    ) { }

    async create(createReciboDto: CreateReciboDto): Promise<Recibo> {
        const { empleadoId } = createReciboDto;

        const empleado = await this.empleadosService.findById(empleadoId);
        if (!empleado) {
            throw new NotFoundException(`Empleado con ID ${empleadoId} no encontrado`);
        }

        const newRecibo = this.reciboRepository.create({
            ...createReciboDto,
            empleado: empleado,
        });

        return this.reciboRepository.save(newRecibo);
    }

    async findByEmpleado(empleadoId: string): Promise<Recibo[]> {
        return this.reciboRepository.find({
            where: { empleado: { id: empleadoId } },
            order: { anio: 'DESC', mes: 'DESC' },
        });
    }
}