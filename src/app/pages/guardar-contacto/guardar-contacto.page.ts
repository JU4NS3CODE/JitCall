import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ContactoService } from 'src/app/shared/services/contacto.service';

@Component({
  selector: 'app-guardar-contacto',
  templateUrl: './guardar-contacto.page.html',
  styleUrls: ['./guardar-contacto.page.scss'],
  standalone: false
})
export class GuardarContactoPage {

  email: string = '';
  avatarPreview: string | undefined;
  uid: string = '';

  form!: FormGroup;

  constructor(private navCtrl: NavController,
              private fb: FormBuilder,
              private authService: AuthenticationService,
              private contactService: ContactoService) {
    this.form = this.fb.group({
      telefono: ['', [Validators.minLength(7), Validators.required]]
    });

    this.authService.getUsuarioActual().then(value => {
      this.uid = value?.uid || '';
    });
  }

  async save() {
    console.log('Form : ', this.form.value);
    const contact = this.form.value;
    await this.contactService.guardar(this.uid,contact.telefono).then(() => {
      console.log('Contacto guardado correctamente');
      // this.navCtrl.navigateBack('/contactos');
    }).catch(error => {
      console.error('Error al guardar el contacto:', error);
    });
  }

}
