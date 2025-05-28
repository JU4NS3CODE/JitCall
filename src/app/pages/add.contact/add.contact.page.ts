import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Contacto } from 'src/app/interfaces/contacto';
import { ContactService } from 'src/app/shared/services/contact.Service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add.contact.page.html',
  styleUrls: ['./add.contact.page.scss'],
  standalone: false,
})
export class AddContactPage {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private modalController = inject(ModalController);
  private router = inject(Router);

  contactForm: FormGroup;
  error: string = '';
  successMessage: string = '';

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  get errorControl() {
    return this.contactForm.controls;
  }

  async onSubmit() {
    this.error = '';
    this.successMessage = '';

    const name = this.contactForm.value.name.trim();
    const phone = this.contactForm.value.phoneNumber.trim();

    try {
      const contactUser = await this.contactService.findUserByPhoneNumber(phone);

      if (!contactUser) {
        this.error = 'No se encontró ningún usuario con ese número.';
        return;
      }

      const currentUserId = this.contactService.getCurrentUserId();

      const contacto: Contacto = {
        uid: contactUser.uid!,
        nombre: name,
        telefono: contactUser.telefono,
        foto: contactUser.foto || ''
      };

      await this.contactService.addContact(currentUserId, contacto);
      this.successMessage = 'Contacto agregado exitosamente.';

      setTimeout(async () => {
        await this.closeModal();
        this.router.navigate(['/home']);
      }, 1000);

    } catch (err: any) {
      this.error = 'Ocurrió un error al agregar el contacto.';
      console.error(err);
    }
  }

  async closeModal() {
    try {
      await this.modalController.dismiss();
    } catch {
      
    }
  }
}
