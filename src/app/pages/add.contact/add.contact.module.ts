import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContactPageRoutingModule } from './add.contact-routing.module';

// Importa la clase correcta, que debe coincidir con la exportación en add.contact.page.ts
import { AddContactPage } from './add.contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddContactPageRoutingModule
  ],
  declarations: [AddContactPage]  // Cambiado aquí también
})
export class AddContactPageModule {}
