import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardarContactoPage } from './guardar-contacto.page';

const routes: Routes = [
  {
    path: '',
    component: GuardarContactoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuardarContactoPageRoutingModule {}
