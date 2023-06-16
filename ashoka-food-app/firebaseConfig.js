import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyBLkmEHFyostvGy7kXgK-AjWb8MRSm7bnk",
    authDomain: "ashoka-food.firebaseapp.com",
    projectId: "ashoka-food",
    storageBucket: "ashoka-food.appspot.com",
    messagingSenderId: "869682950989",
    appId: "1:869682950989:web:5b24c487842215e4257d04",
    measurementId: "G-6MW8BNH4Z9"
}

firebase.initializeApp(firebaseConfig);
