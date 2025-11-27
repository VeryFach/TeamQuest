import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
// Import UserService yang sudah kamu buat
import { UserService } from "./user.service"; // Sesuaikan path

// Sign In dengan Email/Password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign Up dengan Email/Password

export const signUp = async (email: string, password: string, name: string) => {
  try {
    // 1. Buat akun di Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 2. Simpan data detail user ke Firestore Database
    await UserService.createUser({
      id: user.uid, // PENTING: ID Dokumen = UID Auth
      email: user.email || "",
      displayName: name, // Nama dari input form register
      photoURL: "", // Default kosong dulu
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
// Sign In dengan Google (gunakan ID Token dari Google Auth)
export const signInWithGoogle = async (idToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign Out
export const signOutUser = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await firebaseSignOut(auth);
    return { success: true, message: "Sign out berhasil." };
  } catch (error: any) {
    return { success: false, message: error.message || "Sign out gagal." };
  }
};
