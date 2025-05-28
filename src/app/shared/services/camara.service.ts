import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  async seleccionarImagen(): Promise<Blob> {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Esta función solo está disponible en dispositivos móviles');
    }

    try {
      const foto = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt
      });

      if (!foto.webPath) {
        throw new Error('No se obtuvo una ruta válida de la imagen');
      }

      const respuesta = await fetch(foto.webPath);
      if (!respuesta.ok) {
        throw new Error('Error al cargar la imagen desde webPath');
      }

      return await respuesta.blob();
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      throw error;
    }
  }
}
