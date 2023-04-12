// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";

import { createHomeFromLogin } from "./loginPage/loginDom";
import { modifyGroupsArr, modifyTasksArr } from "./state";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3Y_VHuAQPjdhmtPjAPUscTJSLnxPzgc8",
  authDomain: "todoer-2.firebaseapp.com",
  projectId: "todoer-2",
  storageBucket: "todoer-2.appspot.com",
  messagingSenderId: "458139032227",
  appId: "1:458139032227:web:80b812aa2d1e92e4a0bd16",
  databaseURL: "https://todoer-2-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//authentication------------------------------------------------------------------------------------------------------------------------------------
const provider = new GoogleAuthProvider();
const auth = getAuth();

export function signInWithGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        createHomeFromLogin(true)
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
  
    });
}



//RT Database------------------------------------------------------------------------------------------------------------------------------------
const database = getDatabase(app);

//write
export function writeUserTasksServer(taskArr) {
  const userID = auth.currentUser.uid;
  const db = getDatabase();
  set(ref(db, 'users/' + userID + '/tasks'), taskArr);
}

export function writeUserGroupsServer(group) {
    const userID = auth.currentUser.uid;
    const db = getDatabase();
    set(ref(db, 'users/' + userID + '/groups'), group);
}


//read
export function readUserTasksServer(){
  const userID = auth.currentUser.uid;
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userID}/tasks`)).then((snapshot) => {
    if (snapshot.exists()) {
        modifyTasksArr(snapshot.val())
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}
export function readUserGroupsServer(){
    const userID = auth.currentUser.uid;
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userID}/groups`)).then((snapshot) => {
      if (snapshot.exists()) {
          modifyGroupsArr(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
}





