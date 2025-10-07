import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { crearEvento } from '../services/eventoService';

const CrearEventoScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('');

  const manejarCreacion = async () => {
    if (!nombre || !ubicacion || !tipo) {
      Alert.alert('Completa todos los campos');
      return;
    }

    const nuevoEvento = {
      nombre,
      ubicacion,
      tipo,
      latitud: 0,  // Valor dummy para evitar errores
      longitud: 0,
    };

    try {
      await crearEvento(nuevoEvento);
      Alert.alert('Evento creado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Evento (Web)</Text>
      <TextInput placeholder="Nombre del evento" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Ubicación" value={ubicacion} onChangeText={setUbicacion} style={styles.input} />
      <TextInput placeholder="Tipo (Pichanga, Reto...)" value={tipo} onChangeText={setTipo} style={styles.input} />
      <Text style={styles.alerta}>El mapa no está disponible en la versión web.</Text>
      <Button title="Crear Evento" onPress={manejarCreacion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  alerta: {
    textAlign: 'center',
    marginBottom: 12,
    color: 'gray',
  },
});

export default CrearEventoScreen;
