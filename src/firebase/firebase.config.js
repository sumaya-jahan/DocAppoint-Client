import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAsdxapCgoXBca1TjKwdkzGbqn9fdMKMhs",
    authDomain: "docappoint-4aaa6.firebaseapp.com",
    projectId: "docappoint-4aaa6",
    storageBucket: "docappoint-4aaa6.firebasestorage.app",
    messagingSenderId: "753892642564",
    appId: "1:753892642564:web:a0520d87fd11e83f34ca51",
    measurementId: "G-1C4XRM9LBG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;