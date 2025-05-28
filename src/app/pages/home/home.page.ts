import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/shared/services/contact.Service';
import { Contacto } from 'src/app/interfaces/contacto';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  contactos: Contacto[] = [];
  uid: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private contactService: ContactService,
    private router: Router,
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.uid = this.contactService.getCurrentUserId();
      this.contactos = await this.contactService.getContacts(this.uid);
    } catch (err) {
      this.error = 'Error cargando contactos';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async eliminarContacto(contactId: string) {
    try {
      await this.contactService.deleteContact(this.uid, contactId);
      this.contactos = await this.contactService.getContacts(this.uid);
    } catch (err) {
      console.error('Error eliminando contacto', err);
    }
  }

 async goToChat(phoneNumber: string) {
  await this.router.navigate(['/chats', phoneNumber]);
}

  async editContact(contactId: string) {
    await this.router.navigate(['../add.contact', contactId]);
  }
}
