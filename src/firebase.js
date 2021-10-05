import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyB0tPIh99Rwqr6PfBdv60gwfS_s1nxC7x4",
    authDomain: "blogging-app-84c03.firebaseapp.com",
    projectId: "blogging-app-84c03",
    storageBucket: "blogging-app-84c03.appspot.com",
    messagingSenderId: "236217013220",
    appId: "1:236217013220:web:d54914db12c7d4df97adf1",
    measurementId: "G-56XBJD1PD3"
  };



firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db=firebase.firestore();
const storage = firebase.storage();

export { auth ,db, storage};
// export default firebaseConfig hallo;


