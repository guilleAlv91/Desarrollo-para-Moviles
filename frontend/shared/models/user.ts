export interface IUser {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: string
}

export class User implements IUser {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: string;

    constructor(_id: string, nombre: string, apellido: string, email: string, role: string) {
        this._id = _id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.role = role;
    }
}