import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth) {}

  async registrar(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return userCredential.user;
  }

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return userCredential.user;
  }

  salir() {
    return this.auth.signOut();
  }

  async getUsuarioActual(): Promise<User | null> {
    const user = this.auth.currentUser;

    if (user) {
      return user;
    } else {
      return new Promise((resolve) => {
        const unsubscribe = this.auth.onAuthStateChanged((currentUser) => {
          unsubscribe();
          resolve(currentUser);
        });
      });
    }
  }

  async restaurarContraseña(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
    console.log('Password reset email sent');
  }
}
