import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { MensajeService } from 'src/app/shared/services/mensaje.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Message } from 'src/app/interfaces/message';
import { Usuario } from 'src/app/interfaces/usuario';
import { LocalizacionService } from 'src/app/shared/services/localizacion.service';
import { CamaraService } from 'src/app/shared/services/camara.service';
import { VozService } from 'src/app/shared/services/voz.service';
import { LlamadaService } from 'src/app/core/services/llamada.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: false,
})
export class ChatsPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  mensajes$: Observable<any[]> = of([]);
  nuevoMensaje: string = '';

  idUsuarioActual!: string;
  idOtroUsuario?: string;
  usuarioActual?: Usuario;
  otroUsuario?: Usuario;

  idChat: string = '';

  grabando = false;
  urlAudioBlob: string | null = null;

  constructor(
    private chatServicio: MensajeService,
    private ruta: ActivatedRoute,
    private usuarioSrv: UsuarioService,
    private geoSrv: LocalizacionService,
    private camaraSrv: CamaraService,
    private vozSrv: VozService,
    private supabaseService: SupabaseService,
    private llamadaSrv: LlamadaService
  ) {}

  async ngOnInit() {
    this.idOtroUsuario = this.ruta.snapshot.paramMap.get('telefono')!;
    this.idUsuarioActual = localStorage.getItem('user_id') || '';
    this.usuarioActual = await this.usuarioSrv.buscar(this.idUsuarioActual);
    this.otroUsuario = await this.usuarioSrv.buscarPorTelefono(this.idOtroUsuario);

    this.chatServicio
      .crearOuObtenerChat(this.idUsuarioActual, this.idOtroUsuario)
      .then((chatId) => {
        this.idChat = chatId;
        this.mensajes$ = this.chatServicio.escucharMensajes(chatId);
      });
  }

  enviarMensaje() {
    const mensaje: Message = {
      senderId: this.idUsuarioActual,
      type: 'text',
      content: this.nuevoMensaje,
      timestamp: null,
    };

    this.chatServicio.enviarMensaje(this.idChat, mensaje);
    this.nuevoMensaje = '';
  }

  enviarOtroMensaje(archivo: any, tipo: any) {
    const mensaje: Message = {
      senderId: this.idUsuarioActual,
      type: tipo,
      content: archivo,
      timestamp: null,
    };

    this.chatServicio.enviarMensaje(this.idChat, mensaje);
  }

  llamar(){
    const numeroTelefono = this.otroUsuario?.telefono;
    if (numeroTelefono) {
      this.llamadaSrv.joinCall(numeroTelefono)
    } else {
      console.error('Número de teléfono no disponible para llamar.');
    }
  }
  async seleccionarArchivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';

    input.onchange = async () => {
      const archivo = input.files?.[0];
      if (archivo) {
        try {
          const path = `${this.idUsuarioActual}/${Date.now()}_${archivo.name}`;
          const url = await this.supabaseService.uploadFile(archivo, path);

          const mensaje: Message = {
            senderId: this.idUsuarioActual,
            type: 'file',
            content: url,
            timestamp: null,
          };

          await this.chatServicio.enviarMensaje(this.idChat, mensaje);
        } catch (error) {
          console.error('Error subiendo archivo:', error);
        }
      }
    };

    input.click();
  }

  async obtenerUbicacion() {
    try {
      const ubicacion = await this.geoSrv.obtenerUbicacionActual();
      this.enviarOtroMensaje(ubicacion, 'location');
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  enviarFoto() {
    this.camaraSrv
  .seleccionarImagen()
  .then((blob) => {
    const archivo = new File([blob], `${Date.now()}.jpg`, { type: blob.type });

    this.supabaseService
      .uploadFile(archivo, `${this.idUsuarioActual}/${archivo.name}`)
      .then((url) => {
        this.enviarOtroMensaje(url, 'image');
      })
      .catch((error) => {
        console.error('Error subiendo imagen:', error);
      });
  })
  .catch((error) => {
    console.error('Error al tomar la foto:', error);
  });

  }

  async alternarGrabacion() {
    try {
       if (!this.grabando) {
         await this.vozSrv.comenzarGrabacion();
         this.grabando = true;
         this.urlAudioBlob = null;
       } else {
         const { datosGrabacionBase64, tipoMime } = await this.vozSrv.detenerGrabacion();
         this.grabando = false;

         const blob = this.base64aBlob(datosGrabacionBase64, tipoMime);
         this.urlAudioBlob = URL.createObjectURL(blob);

         if (blob) {
          const archivo = new File([blob], `${Date.now()}.jpg`, { type: blob.type });
           const url = await this.supabaseService.uploadFile(
             archivo,
             `${this.idUsuarioActual}/${Date.now()}.aac`
           );
           this.enviarOtroMensaje(url, 'audio');
         }
       }
     } catch (error) {
       console.error('Error de grabación:', error);
       this.grabando = false;
     }
  }

  base64aBlob(base64: string, tipoMime: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice, (c) => c.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: tipoMime });
  }

}
