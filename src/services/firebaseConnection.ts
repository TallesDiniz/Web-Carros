import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlhGIRz3pKr6upFVGDFbBgHZeZixGWWIc",
  authDomain: "webcarros-327de.firebaseapp.com",
  projectId: "webcarros-327de",
  storageBucket: "webcarros-327de.firebasestorage.app",
  messagingSenderId: "1088084000739",
  appId: "1:1088084000739:web:b8fc0eda9a97c3459f2ad6"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export {db, auth};