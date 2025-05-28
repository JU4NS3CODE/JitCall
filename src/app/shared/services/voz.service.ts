import { Injectable } from '@angular/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';

@Injectable({
  providedIn: 'root'
})
export class VozService {

  constructor() {}

  async solicitarPermisos(): Promise<void> {
    const resultado = await VoiceRecorder.requestAudioRecordingPermission();
    if (!resultado.value) {
      throw new Error('Permiso de grabación no concedido');
    }
  }

  async comenzarGrabacion(): Promise<void> {
    await this.solicitarPermisos();
    await VoiceRecorder.startRecording();
  }

  async detenerGrabacion(): Promise<{ datosGrabacionBase64: string; tipoMime: string }> {
    const resultado = await VoiceRecorder.stopRecording();

    const base64 = resultado.value?.recordDataBase64;
    if (!base64) {
      throw new Error('La grabación no devolvió datos válidos');
    }

    return {
      datosGrabacionBase64: base64,
      tipoMime: 'audio/aac',
    };
  }
}
