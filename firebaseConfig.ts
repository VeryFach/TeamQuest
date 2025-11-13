import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD9MqP8RTj6LZUINQzY-sg1cW_3WDzUuMM",
  authDomain: "teamquest-acb3b.firebaseapp.com",
  projectId: "teamquest-acb3b",
  storageBucket: "teamquest-acb3b.firebasestorage.app",
  messagingSenderId: "142027764531",
  appId: "1:142027764531:web:5e6c46add8eebc74418446",
  measurementId: "G-CS8CCKLQ21",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
