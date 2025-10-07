// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AlzaSyAUTGABd_gqB6xVrUqvCSywcvgrAgEMH5IA',
  authDomain: 'anotate-55dfb.firebaseapp.com',
  projectId: 'anotate-55dfb',
  storageBucket: 'anotate-55dfb.appspot.com',
  messagingSenderId: '858302189215',
  appId: '1:858302189215:web:babd75286928ae0f569caa',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
