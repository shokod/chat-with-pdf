import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyACGntUmkjPv6V0ZGnYiLYoQ7qlnxOXKvo",
    authDomain: "chat-with-pdf-38081.firebaseapp.com",
    projectId: "chat-with-pdf-38081",
    storageBucket: "chat-with-pdf-38081.appspot.com",
    messagingSenderId: "677277884152",
    appId: "1:677277884152:web:2ffcfdce73855dbeb9250d",
    measurementId: "G-849PLMEWK7"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  const db = getFirestore(app);
  const storage = getStorage(app);

  export{ db, storage };