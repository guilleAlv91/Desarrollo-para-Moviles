import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Empleado } from '../../empleados/entities/empleado.entity';

export enum TipoLicencia {
    VACACIONES = 'vacaciones',
    ENFERMEDAD = 'enfermedad',
    PERSONAL = 'personal',
    OTRO = 'otro',
}

export enum EstadoLicencia {
    PENDIENTE = 'pendiente',
    APROBADA = 'aprobada',
    RECHAZADA = 'rechazada',
}

@Entity('licencias')
export class Licencia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: TipoLicencia,
    })
    tipo: TipoLicencia;

    @Column({ type: 'date' })
    fechaInicio: Date;

    @Column({ type: 'date' })
    fechaFin: Date;

    @Column({ type: 'text', nullable: true })
    motivo: string;

    @Column({
        type: 'enum',
        enum: EstadoLicencia,
        default: EstadoLicencia.PENDIENTE,
    })
    estado: EstadoLicencia;

    @Column({ type: 'text', nullable: true })
    comentarioAdmin: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @ManyToOne(() => Empleado, (empleado) => empleado.licencias, {
        onDelete: 'CASCADE',
    })
    empleado: Empleado;
}