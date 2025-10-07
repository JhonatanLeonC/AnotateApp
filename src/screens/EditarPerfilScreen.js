import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { guardarPerfilUsuario } from '../services/usuarioService';

const EditarPerfilScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');
  const [alias, setAlias] = useState('');
  const [nivel, setNivel] = useState('');
  const [posicion, setPosicion] = useState('');
  const [foto, setFoto] = useState(null);

  const elegirFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const guardarPerfil = async () => {
    try {
      await guardarPerfilUsuario(user.uid, {
        nombre,
        alias,
        nivel,
        posicion,
        foto,
      });
      Alert.alert('Perfil actualizado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {foto && <Image source={{ uri: foto }} style={styles.foto} />}
      <Button title="Elegir Foto" onPress={elegirFoto} />

      <TextInput placeholder="Nombre completo" style={styles.input} value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Alias" style={styles.input} value={alias} onChangeText={setAlias} />
      <TextInput placeholder="Nivel (Básico, Intermedio, Avanzado)" style={styles.input} value={nivel} onChangeText={setNivel} />
      <TextInput placeholder="Posición (Armador, Líbero, Delantero, etc.)" style={styles.input} value={posicion} onChangeText={setPosicion} />

      <Button title="Guardar Perfil" onPress={guardarPerfil} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  foto: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 },
});

export default EditarPerfilScreen;
