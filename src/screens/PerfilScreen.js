import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { obtenerPerfilUsuario } from '../services/usuarioService';
import { AuthContext } from '../context/AuthContext';

const PerfilScreen = () => {
  const { user } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await obtenerPerfilUsuario(user.uid);
        setPerfil(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      cargarPerfil();
    }
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!perfil) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Perfil no disponible</Text>;
  }

  return (
    <View style={styles.container}>
      {perfil.foto && (
        <Image source={{ uri: perfil.foto }} style={styles.foto} />
      )}
      <Text style={styles.nombre}>{perfil.nombre}</Text>
      <Text style={styles.dato}>Alias: {perfil.alias}</Text>
      <Text style={styles.dato}>Nivel: {perfil.nivel}</Text>
      <Text style={styles.dato}>Posición: {perfil.posicion}</Text>
      <Button title="Editar Perfil" onPress={() => navigation.navigate('EditarPerfil')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40 },
  foto: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  nombre: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  dato: { fontSize: 16, marginBottom: 4 },
});

export default PerfilScreen;
