import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBQNpmpFmvtZpbG-AjUf-gOBnRHDX9F_98",
  authDomain: "simple-project-e7d5c.firebaseapp.com",
  projectId: "simple-project-e7d5c",
  storageBucket: "simple-project-e7d5c.firebasestorage.app",
  messagingSenderId: "934568399001",
  appId: "1:934568399001:web:15801f0dc49e74119ee808",
  measurementId: "G-NXEQYEX658"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth =getAuth()
export const googleProvider = new GoogleAuthProvider()