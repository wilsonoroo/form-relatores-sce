import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD9-UtfaH62AKnKvtHbKhUIpKtPyJJ3-Yo",
  authDomain: "sce-cap-desarrollo.firebaseapp.com",
  projectId: "sce-cap-desarrollo",
  storageBucket: "sce-cap-desarrollo.appspot.com",
  messagingSenderId: "459440786074",
  appId: "1:459440786074:web:944f1bcaeaeab89820ed23",
  measurementId: "G-82SZ4P7GBG"
};

// Inicializa Firebase solo en el entorno del cliente
let app: any;
let analytics: any;
let db: any;
let storage: any;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, analytics, db, storage };
