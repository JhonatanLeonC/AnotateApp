import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import CrearEventoScreen from '../screens/CrearEventoScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import ChatEventoScreen from '../screens/ChatEventoScreen';
// import LoginScreen from '../screens/LoginScreen'; // Temporalmente desactivado

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="CrearEvento" component={CrearEventoScreen} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="ChatEvento" component={ChatEventoScreen} options={{ title: 'Chat del Evento' }} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
