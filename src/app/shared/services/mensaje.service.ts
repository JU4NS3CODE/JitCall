import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  orderBy,
  collectionData,
  addDoc,
  serverTimestamp,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/message';

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: any;
}

@Injectable({
  providedIn: 'root',
})
export class MensajeService {

  constructor(
    private firestore: Firestore,
  ) {}

  generarIdChat(usuarioId1: string, usuarioId2: string): string {
    return [usuarioId1, usuarioId2].sort().join('_');
  }

  async crearOuObtenerChat(usuarioId1: string, usuarioId2: string): Promise<string> {
    const chatId = this.generarIdChat(usuarioId1, usuarioId2);
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    const snapshot = await getDoc(chatRef);

    if (!snapshot.exists()) {
      await setDoc(chatRef, {
        users: [usuarioId1, usuarioId2],
        lastMessage: '',
        updatedAt: serverTimestamp(),
      });
    }

    return chatId;
  }

  escucharMensajes(chatId: string): Observable<Message[]> {
    const mensajesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(mensajesRef, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }

  async enviarMensaje(chatId: string, mensaje: Message): Promise<void> {
    const mensajesRef = collection(this.firestore, `chats/${chatId}/messages`);
    await addDoc(mensajesRef, {
      ...mensaje,
      timestamp: serverTimestamp(),
    });

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    await setDoc(
      chatRef,
      {
        lastMessage: mensaje.type === 'text' ? mensaje.content : mensaje.type,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}