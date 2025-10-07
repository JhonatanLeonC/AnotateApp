/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();
const db = admin.firestore();

// 🔄 Revisa cada 5 minutos si hay eventos que ocurren en 1 hora
exports.notificarEventosProximos = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const ahora = new Date();
    const dentroDeUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);

    const eventosSnapshot = await db.collection('eventos')
      .where('fechaHoraInicio', '>=', admin.firestore.Timestamp.fromDate(ahora))
      .where('fechaHoraInicio', '<=', admin.firestore.Timestamp.fromDate(dentroDeUnaHora))
      .get();

    eventosSnapshot.forEach(async (doc) => {
      const evento = doc.data();
      const inscritos = evento.inscritos || [];

      if (inscritos.length === 0) return;

      const mensajes = inscritos.map((usuario) => ({
        to: usuario.expoPushToken,
        sound: 'default',
        title: '¡Tu evento está por comenzar!',
        body: `Prepárate para el evento: ${evento.nombre}`,
      }));

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mensajes),
      });

      console.log(`Notificados inscritos del evento: ${evento.nombre}`);
    });

    return null;
  });
