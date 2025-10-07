import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, Platform } from 'react-native';
import * as Location from 'expo-location';

let MapView, Marker;

// 👇 Solo importamos react-native-maps en iOS/Android
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

const MapaEventos = ({ eventos = [] }) => {
  const [ubicacion, setUbicacion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Activa la ubicación para ver el mapa.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUbicacion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.mensajeWeb}>
          El mapa no está disponible en la versión web. Usa la app móvil.
        </Text>
      </View>
    );
  }

  if (!ubicacion) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={ubicacion} showsUserLocation>
        {eventos.map((evento, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: evento.latitud,
              longitude: evento.longitud,
            }}
            title={evento.nombre}
            description={evento.tipo}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: 300, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1, width: '100%' },
  mensajeWeb: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    padding: 10,
  },
});

export default MapaEventos;
