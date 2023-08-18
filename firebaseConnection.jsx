import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyAgys9TaqlIQQGxaVvkstBKEkyGGh6eeRA",
    authDomain: "curso-a1ef2.firebaseapp.com",
    projectId: "curso-a1ef2",
    storageBucket: "curso-a1ef2.appspot.com",
    messagingSenderId: "1028711104473",
    appId: "1:1028711104473:web:9097cad089d5e4d93123c8",
    measurementId: "G-YLMB8QYNZJ"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export {db, auth};