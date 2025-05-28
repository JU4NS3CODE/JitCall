import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestCallPageRoutingModule } from './test-call-routing.module';

import { TestCallPage } from './test-call.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TestCallPageRoutingModule
  ],
  declarations: [TestCallPage]
})
export class TestCallPageModule {}
