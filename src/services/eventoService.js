import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';


// 📝 Crear evento
export const crearEvento = async (evento) => {
  try {
    const docRef = await addDoc(collection(db, 'eventos'), {
      ...evento,
      creadoEn: new Date(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Error al crear evento: ' + error.message);
  }
};

export const inscribirseAEvento = async (eventoId, usuario) => {
  try {
    const eventoRef = doc(db, 'eventos', eventoId);
    await updateDoc(eventoRef, {
      inscritos: arrayUnion({
        uid: usuario.uid,
        expoPushToken: usuario.expoPushToken,
      }),
    });
  } catch (error) {
    throw new Error('No se pudo inscribir al evento: ' + error.message);
  }
};

// 📋 Listar eventos
export const listarEventos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'eventos'));
    const eventos = [];
    querySnapshot.forEach((doc) => {
      eventos.push({ id: doc.id, ...doc.data() });
    });
    return eventos;
  } catch (error) {
    throw new Error('Error al listar eventos: ' + error.message);
  }
};
