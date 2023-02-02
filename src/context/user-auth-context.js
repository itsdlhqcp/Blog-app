import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  getUserByUid,
  downloadUserProfilePhoto,
} from "services/firebase/firebase";

import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [currenProfileImg, setCurrenProfileImg] = useState(false);

  async function fetchUserData(uid) {
    try {
      const userData = await getUserByUid(uid);
      if (userData.defaultPhotoFromGoogleAccount === false) {
        try {
          const url = await downloadUserProfilePhoto(uid);
          setCurrenProfileImg(url);
          setUser(userData);
        } catch (error) {
          console.error(error);
          return;
        }
      } else if (userData.defaultPhotoFromGoogleAccount !== false)
        setCurrenProfileImg(userData.defaultPhotoFromGoogleAccount);
      setUser(userData);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  function logOut() {
    return signOut(auth);
  }

  function signInWithGoogle() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser) {
        fetchUserData(currentuser.uid);
      }
      setUser(currentuser);
      console.log(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        logOut,
        signInWithGoogle,
        currenProfileImg,
        fetchUserData,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
