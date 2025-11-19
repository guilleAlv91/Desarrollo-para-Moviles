import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Empleado } from '../../empleados/entities/empleado.entity';

@Entity('asistencias')
export class Asistencia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    fecha: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    horaIngreso: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    horaEgreso: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @ManyToOne(() => Empleado, (empleado) => empleado.asistencias, {
        onDelete: 'CASCADE',
    })
    empleado: Empleado;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}