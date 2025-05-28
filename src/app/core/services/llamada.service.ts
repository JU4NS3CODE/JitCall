import { UsuarioService } from './../../shared/services/usuario.service';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Injectable } from '@angular/core';
import {NotificacionesService} from "./../../shared/services/notificaciones.service"
import { ContactService } from 'src/app/shared/services/contact.Service';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LlamadaService {

  constructor(
    private navCtrl: NavController,
    // private toastService: ToastService,
    private authService: Auth,
    private contactSrv: ContactService
  ) {}

  async acceptCall(meeting: string, name: string) {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('This function available Android.');
      return;
    }

    try {
      await (window as any).Capacitor.Plugins.AppCallPlugin.startCall({
        meetingId: meeting,
        userName: name,
      });
    } catch (error) {
      console.error('❌ Error to call :', error);
    }
  }

  async joinCall(phone: string) {
    const userRecivier = await this.contactSrv.findUserByPhoneNumber(phone);
    const uidCurrent = await this.authService.currentUser;

    if (!uidCurrent || !userRecivier) {
      //  await this.toastService.presentToast('Error to init call', 'danger');
       return;
     }

    const meetingId = this.generateId();

    this.launchCall(meetingId, uidCurrent.displayName).then(() => {
      console.log("APPCALL : Llamada iniciada")
    });
  }

  generateId(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=|;:,.';
    return Array.from(
      { length: 10 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join('');
  }

  async launchCall(meeting: string, name: string | null | undefined) {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('This function available Android.');
      return;
    }
    try {
      await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({
        meetingId: meeting,
        userName: name,
      });
    } catch (error) {
      console.error('❌ Error to call :', error);
    }
  }

  async rejectCall() {
    await this.navCtrl.navigateRoot('/home');
  }
}
