import { Role } from 'src/empleados/enums/role-enum';
export const SEED_EMPLEADOS = [
    {
        email: 'admin@dominio.com',
        password: 'AdminPassword123!',
        nombre: 'Admin',
        apellido: 'Principal',
        role: Role.Admin,
        telefono: '123456789',
        direccion: 'Calle Falsa 123, Oficina Admin',
        fechaContratacion: new Date('2020-01-01'),
    },
    {
        email: 'empleado1@dominio.com',
        password: 'EmpleadoPass123!',
        nombre: 'Juan',
        apellido: 'Pérez',
        role: Role.Empleado,
        telefono: '987654321',
        direccion: 'Avenida Siempre Viva 742',
        fechaContratacion: new Date('2022-05-10'),
    },
    {
        email: 'empleado2@dominio.com',
        password: 'EmpleadoPass456!',
        nombre: 'Ana',
        apellido: 'García',
        role: Role.Empleado,
        telefono: '555444333',
        direccion: 'Boulevard de los Sueños Rotos 44',
        fechaContratacion: new Date('2023-11-20'),
    },
];