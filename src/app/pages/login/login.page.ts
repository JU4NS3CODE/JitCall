import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup
  constructor(private formBuilder: FormBuilder, private authSrv: AuthenticationService) {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
   }

  ngOnInit() {
  }

  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authSrv.login(email, password).then((user) => {
      console.log('Usuario logueado:', user);
    }).catch((error) => {
      console.error('Error al iniciar sesión:', error);
    });
  }

}
