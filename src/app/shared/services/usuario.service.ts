import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private firestore = inject(Firestore);

  async guardar(user: Usuario): Promise<void> {
    try {
      if (!user.uid) {
        throw new Error('UID es requerido para guardar el usuario');
      }
      const userRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userRef, {
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono
      });
      console.log('Usuario guardado exitosamente:', user.uid);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  }

  async buscar(uid: string): Promise<Usuario | undefined> {
    try {
      if (!uid) {
        throw new Error('UID es requerido para buscar el usuario');
      }
      const userRef = doc(this.firestore, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const userData = snap.data() as Omit<Usuario, 'uid'>;
        const usuario: Usuario = {
          uid: snap.id,
          ...userData
        };
        console.log('Usuario encontrado:', usuario);
        return usuario;
      }
      console.log('Usuario no encontrado para uid:', uid);
      return undefined;
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      throw error;
    }
  }

  async actualizar(uid: string, data: Partial<Omit<Usuario, 'uid'>>): Promise<void> {
    try {
      if (!uid) {
        throw new Error('UID es requerido para actualizar el usuario');
      }
      const userRef = doc(this.firestore, 'users', uid);

      const validData: Partial<Omit<Usuario, 'uid'>> = {};
      if (data.nombre !== undefined) validData.nombre = data.nombre;
      if (data.apellido !== undefined) validData.apellido = data.apellido;
      if (data.correo !== undefined) validData.correo = data.correo;
      if (data.telefono !== undefined) validData.telefono = data.telefono;

      await updateDoc(userRef, validData);
      console.log('Usuario actualizado:', uid);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  async eliminar(uid: string): Promise<void> {
    try {
      if (!uid) {
        throw new Error('UID es requerido para eliminar el usuario');
      }
      const userRef = doc(this.firestore, 'users', uid);
      await deleteDoc(userRef);
      console.log('Usuario eliminado:', uid);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  async listar(): Promise<Usuario[]> {
    try {
      const colRef = collection(this.firestore, 'users');
      const snap = await getDocs(colRef);
      return snap.docs.map(doc => {
        const data = doc.data() as Omit<Usuario, 'uid'>;
        return {
          uid: doc.id,
          ...data
        } as Usuario;
      });
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  }

  async buscarPorTelefono(phone: string): Promise<Usuario | undefined> {
    try {
      if (!phone) {
        throw new Error('Teléfono es requerido para la búsqueda');
      }
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('telefono', '==', phone));
      const snapshot = await getDocs(q);

      console.log('Búsqueda por teléfono:', phone);
      console.log('Documentos encontrados:', snapshot.docs.length);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const userData = doc.data() as Omit<Usuario, 'uid'>;
        const usuario: Usuario = {
          uid: doc.id,
          ...userData
        };
        console.log('Usuario encontrado por teléfono:', usuario);
        return usuario;
      }

      console.log('No se encontró usuario con teléfono:', phone);
      return undefined;
    } catch (error) {
      console.error('Error al buscar por teléfono:', error);
      throw error;
    }
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    try {
      if (!correo) {
        throw new Error('Correo es requerido para la búsqueda');
      }
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('correo', '==', correo));
      const snapshot = await getDocs(q);

      console.log('Búsqueda por correo:', correo);
      console.log('Documentos encontrados:', snapshot.docs.length);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const userData = doc.data() as Omit<Usuario, 'uid'>;
        const usuario: Usuario = {
          uid: doc.id,
          ...userData
        };
        console.log('Usuario encontrado por correo:', usuario);
        return usuario;
      }

      console.log('No se encontró usuario con correo:', correo);
      return null;
    } catch (error) {
      console.error('Error al buscar por correo:', error);
      throw error;
    }
  }

  async agregarToken(uid: string, token: string): Promise<void> {
    try {
      if (!uid || !token) {
        throw new Error('UID y token son requeridos');
      }
      const userRef = doc(this.firestore, 'users', uid);
      await updateDoc(userRef, { token: token });
      console.log('Token agregado al usuario:', uid);
    } catch (error) {
      console.error('Error al agregar token:', error);
      throw error;
    }
  }

  private validarUsuario(user: Partial<Usuario>): boolean {
    const camposRequeridos = ['nombre', 'apellido', 'correo', 'telefono'];
    return camposRequeridos.every(campo =>
      user[campo as keyof Usuario] !== undefined &&
      user[campo as keyof Usuario] !== null &&
      user[campo as keyof Usuario] !== ''
    );
  }

  async crearUsuario(userData: Omit<Usuario, 'uid'>, uid: string): Promise<Usuario> {
    try {
      if (!this.validarUsuario(userData)) {
        throw new Error('Datos del usuario incompletos');
      }

      const nuevoUsuario: Usuario = {
        uid,
        ...userData
      };

      await this.guardar(nuevoUsuario);
      return nuevoUsuario;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }
}
