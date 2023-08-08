// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyAvDJNhcHFu045VYVAnFTjmBNkmaDSMWpU",
//   authDomain: "mern-stack-ef0e9.firebaseapp.com",
//   projectId: "mern-stack-ef0e9",
//   storageBucket: "mern-stack-ef0e9.appspot.com",
//   messagingSenderId: "611652026877",
//   appId: "1:611652026877:web:d25871dccd390b98c15994",
//   BucketUrl: "gs://mern-stack-ef0e9.appspot.com",
// };

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