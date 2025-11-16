export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterFormValues {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterPayload {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
}