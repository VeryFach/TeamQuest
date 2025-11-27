import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

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
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
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
