// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEEWremdNL6MavuS40DdZAYnJ387EziR8",
  authDomain: "crud-test-app-38ca4.firebaseapp.com",
  projectId: "crud-test-app-38ca4",
  storageBucket: "crud-test-app-38ca4.appspot.com",
  messagingSenderId: "459676653842",
  appId: "1:459676653842:web:57c8309d5b2669ff47bbcb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

