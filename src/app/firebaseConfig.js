import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCDTJdXbnR6M5SfVszW7-ZNUZh6egr_dgw",
  authDomain: "my-todo-app-4ae86.firebaseapp.com",
  projectId: "my-todo-app-4ae86",
  storageBucket: "my-todo-app-4ae86.appspot.com",
  messagingSenderId: "606094682399",
  appId: "1:606094682399:web:305c6439c55f907d6d282a",
  measurementId: "G-C43GHKJGM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// const auth = getAuth(app);
const db = getFirestore(app);

export {db}