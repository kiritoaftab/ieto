import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCHPZFzR-fW50dBfPCyj1M7uUuyZ_4kwfo",
  authDomain: "database-e1305.firebaseapp.com",
  projectId: "database-e1305",
  storageBucket: "database-e1305.appspot.com",
  messagingSenderId: "990821501822",
  appId: "1:990821501822:web:3eb5f8fd3b4fb40ee2812f",
  measurementId: "G-RWSZRGWJH7"
};
firebase.initializeApp(firebaseConfig);

const db=firebase.firestore();
export default db;