import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authSrv: AuthenticationService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.checkAuthState();
  }

  private checkAuthState() {
    this.authSrv.user$.subscribe(user => {
      if (user && !this.isLoading) {
        console.log('Usuario ya autenticado, redirigiendo...');
        this.router.navigate(['/home']);
      }
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.isLoading = true;

      const user = await this.authSrv.login(email, password);

      await loading.dismiss();

      console.log('Login exitoso:', user.uid);

      await this.showAlert('Éxito', 'Sesión iniciada correctamente');

      this.router.navigate(['/home']);

    } catch (error: any) {
      await loading.dismiss();
      console.error('Error al iniciar sesión:', error);

      let errorMessage = 'Error al iniciar sesión';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
      } else if (error.message) {
        errorMessage = error.message;
      }

      await this.showAlert('Error', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
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

  goToRegister() {
    this.router.navigate(['/registrar']);
  }
}
