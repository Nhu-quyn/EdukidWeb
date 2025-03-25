import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Thay bằng thông tin từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAlw4-T-i_LmvkNPMdISciESFrtdyGB8fA",
  authDomain: "project1-22f97.firebaseapp.com",
  projectId: "project1-22f97",
  storageBucket: "project1-22f97.firebasestorage.app",
  messagingSenderId: "781577405269",
  appId: "1:781577405269:web:4da16b724c2b56d77c65dc",
  measurementId: "G-EZ922KTXSF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Hàm đăng nhập Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(); // Lấy token từ Firebase
    return idToken; // Gửi token này lên backend để xác thực
  } catch (error) {
    console.error("Login Failed:", error);
  }
};

export { signInWithGoogle };
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAlw4-T-i_LmvkNPMdISciESFrtdyGB8fA",
//   authDomain: "project1-22f97.firebaseapp.com",
//   projectId: "project1-22f97",
//   storageBucket: "project1-22f97.firebasestorage.app",
//   messagingSenderId: "781577405269",
//   appId: "1:781577405269:web:4da16b724c2b56d77c65dc",
//   measurementId: "G-EZ922KTXSF"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
