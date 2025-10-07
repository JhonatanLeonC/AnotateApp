import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';


export const obtenerPerfilUsuario = async (uid) => {
  try {
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('El perfil no existe');
    }
  } catch (error) {
    throw new Error('Error al obtener perfil: ' + error.message);
  }
};

// Crear o actualizar perfil del usuario
export const guardarPerfilUsuario = async (uid, datos) => {
  try {
    await setDoc(doc(db, 'usuarios', uid), datos);
  } catch (error) {
    throw new Error('Error al guardar perfil: ' + error.message);
  }
};
