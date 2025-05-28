export interface Usuario {
  foto?: string | null;
  uid?: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  token?: string;
}
