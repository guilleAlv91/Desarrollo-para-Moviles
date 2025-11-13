import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpleadosService {
    constructor(
        @InjectRepository(Empleado)
        private readonly empleadoRepository: Repository<Empleado>,
    ) { }

    async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
        const { email } = createEmpleadoDto;

        const existingUser = await this.empleadoRepository.findOneBy({ email });
        if (existingUser) {
            throw new ConflictException('El email ya está en uso');
        }

        const newEmpleado = this.empleadoRepository.create(createEmpleadoDto);
        return this.empleadoRepository.save(newEmpleado);
    }

    async findAll(): Promise<Empleado[]> {
        return this.empleadoRepository.find();
    }

    async findById(
        id: string,
        selectPassword = false,
    ): Promise<Empleado | null> {
        const query = this.empleadoRepository.createQueryBuilder('empleado');

        if (selectPassword) {
            query.addSelect('empleado.password');
        }

        query.where('empleado.id = :id', { id });

        const empleado = await query.getOne();

        if (!empleado) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }
        return empleado;
    }

    async findByEmail(email: string): Promise<Empleado | null> {
        return this.empleadoRepository.findOneBy({ email });
    }

    async update(
        id: string,
        updateEmpleadoDto: UpdateEmpleadoDto,
    ): Promise<Empleado> {
        const empleado = await this.empleadoRepository.preload({
            id,
            ...updateEmpleadoDto,
        });

        if (!empleado) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }

        return this.empleadoRepository.save(empleado);
    }

    async remove(id: string): Promise<{ message: string }> {
        const result = await this.empleadoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }
        return { message: `Empleado con ID ${id} eliminado correctamente` };
    }

    // Método para el script de seed (limpieza)
    async removeAll(): Promise<void> {
        await this.empleadoRepository.delete({});
    }
}