// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH-e5vJStBhRCeRKVUGeDScugI-T6g0iA",
  authDomain: "test-promp.firebaseapp.com",
  projectId: "test-promp",
  storageBucket: "test-promp.appspot.com",
  messagingSenderId: "183966145904",
  appId: "1:183966145904:web:f662cf71fccadb9afc03b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };