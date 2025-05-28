import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LlamadaPageRoutingModule } from './llamada-routing.module';

import { LlamadaPage } from './llamada.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LlamadaPageRoutingModule
  ],
  declarations: [LlamadaPage]
})
export class LlamadaPageModule {}
