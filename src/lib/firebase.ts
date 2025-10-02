// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-6136093379-11c92",
  "appId": "1:796012307965:web:ac1c23e9519b1b0d6ca594",
  "apiKey": "AIzaSyD1TtPHsrgt6uVzXEB9cPF8YXTwTznVehY",
  "authDomain": "studio-6136093379-11c92.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "796012307965"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { db };
