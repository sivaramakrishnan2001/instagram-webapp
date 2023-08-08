import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  BucketUrl: process.env.REACT_APP_BUCKETURL,
};

console.log("firebaseConfig", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

//Access Firebase cloud messaging
const messaging = getMessaging(app);

// Storage
export const Storage = getStorage(app, process.env.REACT_APP_BUCKETURL);




/*
This function allows us to get your device token from Firebase 
which is required for sending Push notifications to your device.
*/
export const getTokenFromFirebase = async () => {

  let currentToken = '';
  try {
    currentToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPIDKEY });
    console.log("currentToken", currentToken);
    if (currentToken) {
    } else {
    }
  } catch (error) {
    console.log('An error occurred while retrieving token.', error);
  }
  finally {

  }
  console.log("currentToken", currentToken);
  return currentToken

};

//This function listens to push messages on the server
// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             console.log(payload);
//             resolve(payload);
//         });
//     });


// function requestPermission() {
//   console.log("Requesting permission...");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//       const app = initializeApp(firebaseConfig);

//       const messaging = getMessaging(app);
//       console.log("messaging", messaging);
//       getToken(messaging, {
//         vapidKey:
//           "BI5jjT3X4q2l1tgWAY1D9oi7pfbX2lFAyT7r7Bxup4nBz37eG1kw6MVozb3-oguRYTUcvnE7-NWkqjQE-SQqAx8",
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log("currentToken: ", currentToken);
//         } else {
//           console.log("Can not get token");
//         }
//       });
//     } else {
//       console.log("Do not have permission!");
//     }
//   });
// }

// requestPermission();


// function requestPermission() {
//   console.log("Requesting permission...");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//       const app = initializeApp(firebaseConfig);

//       const messaging = getMessaging(app);
//       getToken(messaging, {
//         vapidKey:
//           "BI5jjT3X4q2l1tgWAY1D9oi7pfbX2lFAyT7r7Bxup4nBz37eG1kw6MVozb3-oguRYTUcvnE7-NWkqjQE-SQqAx8",
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log("currentToken: ", currentToken);
//         } else {
//           console.log("Can not get token");
//         }
//       });
//     } else {
//       console.log("Do not have permission!");
//     }
//   });
// }

// requestPermission();


