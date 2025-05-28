import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private url = environment.ravish + 'notifications';
  private urlLogin = environment.ravish + 'user/login';

  constructor(private http: HttpClient, private usuarioService: UsuarioService) {}

  async init() {
    const email = environment.user.email;
    const password = environment.user.password;

    this.http.post<any>(this.urlLogin, { email, password }).subscribe((res) => {
      const token = res?.data?.access_token;
      console.log('Token: ', token);
      if (token) {
        localStorage.setItem('token', token);
      }
      console.log(res);
    });
  }

  async enviarNoti(
    type: 'incoming_call' | 'message',
    data: {
      meetingId?: string;
      userSend: { uid: string; name: string };
      userReceiver: { uid: string; name: string; token?: string };
    }
  ) {
    const { userSend, userReceiver, meetingId } = data;
    const token = userReceiver?.token;
    const priority = 'high';

    const titles = {
      incoming_call: 'Incoming call...',
      message: 'New message received',
    };

    const bodies = {
      incoming_call: `${userSend.name} is calling you`,
      message: `${userSend.name}: 'Sent you a message'`,
    };

    const payload = {
      token,
      notification: {
        title: titles[type],
        body: bodies[type],
      },
      android: {
        priority,
        data: {
          type: 'incoming_call',
          userId: userSend.uid,
          name: userSend.name,
          userFrom: userReceiver.uid,
          meetingId: meetingId || 'no_meeting',
        },
      },
    };

    console.log('Payload', JSON.stringify(payload));

    try {
      console.log('🚀 Enviando notificación al servidor:', payload);
      await firstValueFrom(this.http.post(this.url, payload));
      console.log('✅ Notificación enviada correctamente.');
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
    }
  }
}
