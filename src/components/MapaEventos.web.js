import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapaEventos = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>El mapa no está disponible en la versión web.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    marginVertical: 20,
  },
  texto: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
});

export default MapaEventos;
