const firebaseConfig = {
    apiKey: "TUMHARI_API_KEY",
    authDomain: "TUMHARA_PROJECT.firebaseapp.com",
    databaseURL: "https://TUMHARA_PROJECT-default-rtdb.firebaseio.com",
    projectId: "TUMHARA_PROJECT",
    storageBucket: "TUMHARA_PROJECT.appspot.com",
    messagingSenderId: "123456789",
    appId: "TUMHARI_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
