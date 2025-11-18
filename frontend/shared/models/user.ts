export interface IUser {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: string;
    telefono: number;

}

export class User implements IUser {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: string;
    telefono: number;

    constructor(_id: string, nombre: string, apellido: string, email: string, role: string, telefono: number) {
        this._id = _id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.role = role;
        this.telefono = telefono;
    }
}