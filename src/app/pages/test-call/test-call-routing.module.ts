import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCallPage } from './test-call.page';

const routes: Routes = [
  {
    path: '',
    component: TestCallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCallPageRoutingModule {}
