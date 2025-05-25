import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Contacto } from 'src/app/interfaces/contacto';
import { ContactoService } from 'src/app/shared/services/contacto.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {


  contacts: Contacto[] = [];
  uid!: string;

  constructor(
    private contactService: ContactoService,
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.authService.getUsuarioActual().then(value => {
      this.uid = value?.uid || '';
    });
  }

  async ngOnInit() {
    this.contactService.contacts$.subscribe(contacts => {
      this.contacts = contacts;
    });
    await this.loadContacts();
  }

  async loadContacts() {
    await this.contactService.loadAll(this.uid);
  }

  async goToDetail(id: any) {
    await this.router.navigate(['/contact-detail/' + id]);
  }

}
