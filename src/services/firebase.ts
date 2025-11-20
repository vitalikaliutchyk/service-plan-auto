import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw6bIk1fcG5X0hssug3W9csWukZ7543WI",
  authDomain: "service-plan-auto.firebaseapp.com",
  projectId: "service-plan-auto",
  storageBucket: "service-plan-auto.firebasestorage.app",
  messagingSenderId: "274549742564",
  appId: "1:274549742564:web:4cc5103d08c9ffdc2585f1"
};

// Modular Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Compat Firestore for robust import support
// Use existing app if available to prevent duplicate initialization errors
const compatApp = firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(firebaseConfig);
export const db = compatApp.firestore();