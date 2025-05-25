import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private firestore = inject(Firestore);

  async guardar(user: Usuario) {
    const userRef = doc(this.firestore, 'users', user.uid);
    await setDoc(userRef, user);
  }

  async buscar(uid: any): Promise<User | undefined> {
    const userRef = doc(this.firestore, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as User) : undefined;
  }

  async actualizar(uid: string, data: Partial<Omit<User, 'uid' | 'email'>>) {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, data);
  }

  async eliminar(uid: string) {
    const userRef = doc(this.firestore, 'users', uid);
    await deleteDoc(userRef);
  }

  async listar(): Promise<User[]> {
    const colRef = collection(this.firestore, 'users');
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.data() as User);
  }

  async buscarPorTelefono(phone: string): Promise<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('telefono', '==', phone));
    const snapshot = await getDocs(q);
    console.log('snapshot', snapshot.docs[0]);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { uid: doc.id, ...doc.data() } as User;
    }
    return null;
  }

  async agregarToken(user: any, token: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userRef, {token: token});
  }
}
