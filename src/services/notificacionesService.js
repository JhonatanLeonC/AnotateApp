import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

// ✅ Solicita permiso y devuelve el token del dispositivo
export const solicitarPermisoNotificaciones = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permiso denegado para notificaciones');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Debes usar un dispositivo físico para recibir notificaciones');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return token;
};

// ✅ Enviar notificación push inmediata a un solo token
export const enviarNotificacion = async (expoPushToken, titulo, cuerpo) => {
  const mensaje = {
    to: expoPushToken,
    sound: 'default',
    title: titulo,
    body: cuerpo,
    data: { extra: 'info' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mensaje),
  });
};

// ✅ Enviar notificación a varios usuarios inscritos (máximo 100 por lote)
export const notificarAInscritos = async (inscritos, titulo, cuerpo) => {
  const mensajes = inscritos.map((inscrito) => ({
    to: inscrito.expoPushToken,
    sound: 'default',
    title: titulo,
    body: cuerpo,
  }));

  const chunks = [];

  while (mensajes.length) {
    chunks.push(mensajes.splice(0, 100));
  }

  for (const grupo of chunks) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grupo),
    });
  }
};
