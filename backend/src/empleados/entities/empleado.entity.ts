import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role-enum';
import { Licencia } from 'src/licencias/entities/licencia.entity';
import { Recibo } from 'src/recibos/entities/recibo.entity';
import { Exclude } from 'class-transformer';
import { Asistencia } from '../../asistencias/entities/asistencia.entity';

@Entity('empleados')
export class Empleado {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Exclude({ toPlainOnly: true })
    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    apellido: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.Empleado,
    })
    role: Role;

    @Column({ type: 'varchar', length: 50, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    direccion: string;

    @Column({ type: 'date', nullable: true })
    fechaContratacion: Date;

    @OneToMany(() => Licencia, (licencia) => licencia.empleado)
    licencias: Licencia[];

    @OneToMany(() => Recibo, (recibo) => recibo.empleado)
    recibos: Recibo[];

    @OneToMany(() => Asistencia, (asistencia) => asistencia.empleado)
    asistencias: Asistencia[];

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
}