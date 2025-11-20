import { Role } from 'src/empleados/enums/role-enum';
export const SEED_EMPLEADOS = [
    {
        email: 'empleado1@mail.com',
        password: 'password',
        nombre: 'Juan',
        apellido: 'Pérez',
        role: Role.Empleado,
        telefono: '987654321',
        direccion: 'Avenida Siempre Viva 742',
        fechaContratacion: new Date('2022-05-10'),
    },
    {
        email: 'empleado2@mail.com',
        password: 'EmpleadoPass456!',
        nombre: 'Ana',
        apellido: 'García',
        role: Role.Empleado,
        telefono: '555444333',
        direccion: 'Boulevard de los Sueños Rotos 44',
        fechaContratacion: new Date('2023-11-20'),
    },
    {
        email: 'admin@mail.com',
        password: 'AdminPassword123!',
        nombre: 'Admin',
        apellido: 'Principal',
        role: Role.Admin,
        telefono: '123456789',
        direccion: 'Calle Falsa 123, Oficina Admin',
        fechaContratacion: new Date('2020-01-01'),
    },
];