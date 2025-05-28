import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { PushNotiService } from './services/push-noti.service';

@NgModule({
  declarations: [],
  imports: [
    
  ],providers: [provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), PushNotiService],
})
export class CoreModule { }
