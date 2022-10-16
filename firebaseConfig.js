import {initializeApp} from 'firebase/app'
import {getFirestore}  from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDa-PgGWcQJOuhtw31dvn21-MHqZr9lT1I",
    authDomain: "blog-2913e.firebaseapp.com",
    projectId: "blog-2913e",
    storageBucket: "blog-2913e.appspot.com",
    messagingSenderId: "116639024021",
    appId: "1:116639024021:web:12f2078b6fd9dc236aac9c"
  };

  export const app = initializeApp(firebaseConfig)
  export const database = getFirestore(app)