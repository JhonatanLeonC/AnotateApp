import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';

const ChatEventoScreen = ({ route }) => {
  const { eventoId } = route.params;
  const { user } = useContext(AuthContext);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, `eventos/${eventoId}/mensajes`),
      orderBy('creadoEn', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nuevos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMensajes(nuevos);
    });
    return unsubscribe;
  }, []);

  const enviarMensaje = async () => {
    if (texto.trim() === '') return;
    await addDoc(collection(db, `eventos/${eventoId}/mensajes`), {
      texto,
      uid: user.uid,
      autor: user.email, // o alias si lo tienes
      creadoEn: new Date(),
    });
    setTexto('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mensaje}>
            <Text style={styles.autor}>{item.autor}</Text>
            <Text>{item.texto}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          style={styles.input}
          placeholder="Escribe tu mensaje..."
        />
        <Button title="Enviar" onPress={enviarMensaje} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  mensaje: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  autor: { fontWeight: 'bold', marginBottom: 2 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
  },
});

export default ChatEventoScreen;
