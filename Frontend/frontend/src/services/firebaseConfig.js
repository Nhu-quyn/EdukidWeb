import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Cấu hình Firebase - Sửa lại storageBucket
const firebaseConfig = {
  apiKey: "AIzaSyAlw4-T-i_LmvkNPMdISciESFrtdyGB8fA",
  authDomain: "project1-22f97.firebaseapp.com",
  projectId: "project1-22f97",
  storageBucket: "project1-22f97.firebasestorage.app",
  messagingSenderId: "781577405269",
  appId: "1:781577405269:web:4da16b724c2b56d77c65dc",
  measurementId: "G-EZ922KTXSF",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Hàm đăng nhập Google
// const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const idToken = await result.user.getIdToken(); // Lấy token từ Firebase
//     return idToken; // Gửi token này lên backend để xác thực
//   } catch (error) {
//     console.error("Đăng nhập thất bại:", error);
//   }
// };

export { auth, provider };
