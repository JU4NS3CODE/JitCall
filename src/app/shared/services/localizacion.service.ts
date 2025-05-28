import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocalizacionService {

  constructor() { }

  async obtenerUbicacionActual(): Promise<Position> {
    if (Capacitor.getPlatform() !== 'android') {
      throw new Error('Este servicio solo está disponible en dispositivos móviles');
    }

    const permisos = await Geolocation.checkPermissions();
    if (permisos.location !== 'granted') {
      const solicitud = await Geolocation.requestPermissions();
      if (solicitud.location !== 'granted') {
        throw new Error('Permiso de ubicación no concedido');
      }
    }

    const posicion = await Geolocation.getCurrentPosition();
    return posicion;
  }
}
