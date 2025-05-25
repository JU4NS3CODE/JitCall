import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false
})
export class RegistrarPage implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private userSrv: UsuarioService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(6)]],
      apellido: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onRegister() {
    const { correo, nombre, apellido, telefono, contraseña } = this.registerForm.value;

    try {
      const userAuth = await this.authService.registrar(correo, contraseña);
      const uid = userAuth.uid;
      await this.userSrv.guardar({nombre, apellido, telefono, uid, correo});
      this.registerForm.reset()
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error(error);
    }
  }

  async goToLogin() {
    await this.router.navigate(['/login']);
  }

}
