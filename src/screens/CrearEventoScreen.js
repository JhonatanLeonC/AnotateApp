import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { crearEvento } from '../services/eventoService';
import { programarNotificacionLocal } from '../services/notificacionesService';

let MapView, Marker;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

const CrearEventoScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [coordenadas, setCoordenadas] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Activa la ubicación para seleccionar en el mapa.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoordenadas({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const manejarCreacion = async () => {
    if (!nombre || !ubicacion || !tipo || !coordenadas) {
      Alert.alert('Completa todos los campos');
      return;
    }

    const nuevoEvento = {
      nombre,
      ubicacion,
      tipo,
      latitud: coordenadas.latitude,
      longitud: coordenadas.longitude,
    };

    try {
      await crearEvento(nuevoEvento);
      await programarNotificacionLocal(
        `Nuevo evento: ${nombre}`,
        `Ubicación: ${ubicacion}`,
        new Date(Date.now() + 5000)
      );
      Alert.alert('Evento creado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Evento</Text>

      <TextInput placeholder="Nombre del evento" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Ubicación" value={ubicacion} onChangeText={setUbicacion} style={styles.input} />
      <TextInput placeholder="Tipo (Pichanga, Reto...)" value={tipo} onChangeText={setTipo} style={styles.input} />

      {Platform.OS !== 'web' && coordenadas ? (
        <MapView
          style={styles.map}
          region={coordenadas}
          onPress={(e) => setCoordenadas(e.nativeEvent.coordinate)}
        >
          <Marker coordinate={coordenadas} />
        </MapView>
      ) : (
        <Text style={styles.mensajeWeb}>
          El mapa no está disponible en la versión web.
        </Text>
      )}

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
  map: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  mensajeWeb: {
    marginVertical: 10,
    color: 'gray',
    textAlign: 'center',
  },
});

export default CrearEventoScreen;
