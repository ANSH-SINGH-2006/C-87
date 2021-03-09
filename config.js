import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyD-mb9HXvoHtZQY4Kjyp_v9sMb4euv4Egg",
  authDomain: "book-santa-339b8.firebaseapp.com",
  projectId: "book-santa-339b8",
  storageBucket: "book-santa-339b8.appspot.com",
  messagingSenderId: "532169429240",
  appId: "1:532169429240:web:439bd7bd83aac0121deb0d"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
