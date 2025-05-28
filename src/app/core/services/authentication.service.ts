import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/shared/services/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth = inject(Auth);

  constructor(private usuarioService: UsuarioService) {}

  get user$(): Observable<User | null> {
    return authState(this.auth);
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  async registrar(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = credential.user;
    const userData = await this.usuarioService.buscar(user.uid);
    if (!userData) throw new Error('Usuario no encontrado en Firestore');
    return user;
  }

  async logout() {
    await signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  async getUsuarioActual() {
    const currentUser = this.currentUser;
    if (!currentUser) return null;
    return await this.usuarioService.buscar(currentUser.uid);
  }
}
