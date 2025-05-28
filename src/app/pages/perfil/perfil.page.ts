import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UsuarioService } from '../../shared/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  user: Usuario | null = null;
  isEditing = false;

  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private auth: Auth,
    private router: Router,
    private supabaseService: SupabaseService,
    private mediaService: MediaService,
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando perfil...' });
    await loading.present();

    try {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        const result = await this.usuarioService.buscar(currentUser.uid);
        this.user = result ? (result as Usuario) : null;
        if (this.user?.foto) {
          this.imagePreview = this.user.foto;
        }
        console.log('Usuario cargado:', this.user);
      } else {
        this.user = null;
        console.warn('No hay usuario autenticado');
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }

    await loading.dismiss();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.imageFile = null;
      this.imagePreview = this.user?.foto ?? null; 
    }
    console.log('Modo edición:', this.isEditing);
  }

  async pickImage() {
    try {
      const imagePath = await this.mediaService.captureImage();
      const response = await fetch(imagePath);
      const blob = await response.blob();
      this.imageFile = new File([blob], `photo_${Date.now()}.jpg`, { type: blob.type });
      this.imagePreview = URL.createObjectURL(this.imageFile);
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  }

  async guardarCambios() {
    if (!this.user || !this.user.uid) {
      console.warn('Usuario no válido para guardar cambios:', this.user);
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();

    try {
      let nuevaFotoUrl = this.user.foto ?? null;

      if (this.imageFile) {

        if (this.user.foto) {
          const partes = this.user.foto.split('/');
          const nombreArchivo = partes[partes.length - 1];
          await this.supabaseService.deleteImage(`usuarios/${nombreArchivo}`);
        }

        const path = `usuarios/${this.user.uid}_${this.imageFile.name}`;
        nuevaFotoUrl = await this.supabaseService.uploadFile(this.imageFile, path);
      }


      await this.usuarioService.actualizar(this.user.uid, {
        nombre: this.user.nombre,
        apellido: this.user.apellido,
        telefono: this.user.telefono,
        correo: this.user.correo,
        foto: nuevaFotoUrl
      });

      this.user.foto = nuevaFotoUrl;
      this.imageFile = null;
      this.imagePreview = nuevaFotoUrl;

      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Perfil actualizado correctamente.',
        buttons: ['OK'],
      });
      await alert.present();

    } catch (error) {
      console.error('Error al guardar cambios:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo guardar el perfil',
        buttons: ['OK'],
      });
      await alert.present();
    }

    await loading.dismiss();
    this.isEditing = false;
  }

  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: async () => {
            await this.auth.signOut();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}
