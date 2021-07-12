import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBEBiJY9S3PYB5J0zcGRfUV7S_Ag9CqrI8",
  authDomain: "role-based-app-c564a.firebaseapp.com",
  projectId: "role-based-app-c564a",
  storageBucket: "role-based-app-c564a.appspot.com",
  messagingSenderId: "877035048954",
  appId: "1:877035048954:web:e77ed5b95b84fafdf15e43",
  measurementId: "G-HSCRNFGQPF",
};
// Initialize Firebase
const fire: firebase.app.App = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

export { fire, auth, database };
