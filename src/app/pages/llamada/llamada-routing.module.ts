import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LlamadaPage } from './llamada.page';

const routes: Routes = [
  {
    path: '',
    component: LlamadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LlamadaPageRoutingModule {}
