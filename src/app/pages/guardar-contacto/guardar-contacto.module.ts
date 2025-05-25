import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuardarContactoPageRoutingModule } from './guardar-contacto-routing.module';

import { GuardarContactoPage } from './guardar-contacto.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    GuardarContactoPageRoutingModule
  ],
  declarations: [GuardarContactoPage]
})
export class GuardarContactoPageModule {}
