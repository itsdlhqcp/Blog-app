import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "services/firebase/firebase";

export default function useAuth() {
  const googleProvider = new GoogleAuthProvider();
  async function signInWithGoogle() {
    try {
      const res = await signInWithPopup(auth, googleProvider);
    } catch (err) {
      alert(err.message);
    }
  }

  return [signInWithGoogle];
}
