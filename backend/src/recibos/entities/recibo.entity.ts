import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Empleado } from '../../empleados/entities/empleado.entity';

@Entity('recibos')
export class Recibo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    mes: number; // 1-12

    @Column({ type: 'int' })
    anio: number;

    @Column({ type: 'varchar', length: 512 })
    urlArchivo: string; // URL a un S3, Firebase Storage, o similar

    @CreateDateColumn({ type: 'datetime' })
    fechaCarga: Date; datetime

    @ManyToOne(() => Empleado, (empleado) => empleado.recibos, {
        onDelete: 'CASCADE',
    })
    empleado: Empleado;
}