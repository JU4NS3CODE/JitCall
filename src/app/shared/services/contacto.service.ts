import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { Contacto } from 'src/app/interfaces/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    private firestore: Firestore,
    private userService: UsuarioService) {
  }

  private contactsSubject = new BehaviorSubject<Contacto[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  private getContactsCollectionRef(uid: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `users/${uid}/contacts`);
  }

  async guardar(uid: string, phone: string) {
    const user = await this.userService.buscarPorTelefono(phone);
    if (user === null) {
      console.error('Usuario no encontrado con el teléfono proporcionado:', phone);
      return;
    }
    const contact = { user_uid: user.uid };
    const colRef = this.getContactsCollectionRef(uid);
    await addDoc(colRef, contact);
    await this.loadAll(uid);
  }

  async loadAll(uid: string): Promise<void> {
    const contactRef = this.getContactsCollectionRef(uid);
    const contactSnapshots = await getDocs(contactRef);

    const results: Contacto[] = [];

    this.contactsSubject.next(results);
  }

  // get(uid: string, contactId: string): Observable<Contacto | undefined> {
  //   const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
  //   return from(this.buildContactDto(contactRef));
  // }

  // private async buildContactDto(contactRef: any): Promise<Contacto | undefined> {
  //   const contactSnap = await getDoc(contactRef);
  //   if (!contactSnap.exists()) {
  //     return undefined;
  //   }

  //   const contactData = contactSnap.data() as { [key: string]: any };
  //   const userUid = contactData['user_uid'];

  //   const userRef = doc(this.firestore, `users/${userUid}`);
  //   const userSnap = await getDoc(userRef);

  //   if (!userSnap.exists()) {
  //     return undefined;
  //   }

  //   const userData = userSnap.data();
  //   return {
  //     uid: contactSnap.id,
  //     nickname: contactData['nickname'],
  //     user: {
  //       uid: userSnap.id,
  //       ...userData
  //     } as User
  //   };
  // }

  // async update(uid: string, contactId: string, data: Partial<Contacto>) {
  //   const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
  //   await updateDoc(contactRef, data);
  //   await this.loadAll(uid);
  // }

  // async delete(uid: string, contactId: string) {
  //   try {
  //     const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
  //     const snapshot = await getDoc(contactRef);

  //     if (!snapshot.exists()) {
  //       console.log('El contacto no existe.');
  //       return;
  //     }

  //     await deleteDoc(contactRef);
  //     console.log('Contacto eliminado exitosamente.');
  //   } catch (error) {
  //     console.error('Error eliminando contacto:', error);
  //   }
  // }
}
