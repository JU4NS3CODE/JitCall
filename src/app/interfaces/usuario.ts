export interface Usuario {
  uid: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo?: string;
  foto?: string;
  token?: string;
}
