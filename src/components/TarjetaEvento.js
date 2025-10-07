import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TarjetaEvento = ({ nombre, ubicacion, tipo }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.texto}>📍 {ubicacion}</Text>
      <Text style={styles.texto}>🏷️ Tipo: {tipo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: '#555',
  },
});

export default TarjetaEvento;
