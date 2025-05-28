import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false,
})
export class RegistrarPage implements OnInit {

  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private userSrv: UsuarioService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const { correo, nombre, apellido, telefono, contraseña } = this.registerForm.value;

    const loading = await this.loadingCtrl.create({
      message: 'Registrando usuario...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.isLoading = true;

     
      console.log('Registrando usuario con teléfono:', telefono);

      loading.message = 'Creando cuenta...';
      const userAuth = await this.authService.registrar(correo, contraseña);
      const uid = userAuth.uid;
      console.log('Usuario creado en Firebase Auth:', uid);

      loading.message = 'Guardando datos...';
      const userData = {
        nombre,
        apellido,
        telefono,
        uid,
        correo,
        foto: ''
      };

      console.log('Guardando usuario en Firestore:', userData);
      await this.userSrv.guardar(userData);

      await loading.dismiss();

      this.resetForm();
      await this.showAlert('Éxito', 'Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);

    } catch (error: any) {
      await loading.dismiss();
      console.error('Error en registro:', error);

      let errorMessage = 'Ocurrió un error durante el registro';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está registrado';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.message) {
        errorMessage = error.message;
      }

      await this.showAlert('Error', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }


  private resetForm() {
    this.registerForm.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async goToLogin() {
    await this.router.navigate(['/login']);
  }
}
