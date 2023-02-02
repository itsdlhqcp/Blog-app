import NavBarBootstrap from "components/nav-bar";
import { useUserAuth } from "context/user-auth-context";
import { useNavigate } from "react-router-dom";
import {
  getUserByUid,
  existUsername,
  createUser,
} from "services/firebase/firebase";

export default function Header() {
  const { signInWithGoogle, logOut, user } = useUserAuth();
  const navigate = useNavigate();

  async function handleGoogleSignIn(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithGoogle();
      console.log(
        userCredential.user.uid,
        userCredential.user.displayName,
        userCredential.user.photoURL
      );
      const uid = userCredential.user.uid;
      const defaultPhotoFromGoogleAccount = userCredential.user.photoURL;
      const username = userCredential.user.displayName;

      const userData = await getUserByUid(uid);

      // If user don't exist create a new user
      if (!userData) {
        let newUser;
        // Returns the uid associated with the username, otherwise returns false
        let isUsernameTaken = await existUsername(username);
        if (isUsernameTaken) {
          let count = 0;
          let tempUsername = username + count;
          isUsernameTaken = await existUsername(tempUsername);

          while (isUsernameTaken) {
            count++;
            tempUsername = username + count;
            console.log(tempUsername);
            isUsernameTaken = await existUsername(tempUsername);
          }
          newUser = {
            uid: uid,
            username: tempUsername,
            defaultPhotoFromGoogleAccount: defaultPhotoFromGoogleAccount,
          };
        } else {
          newUser = {
            uid: uid,
            username: username,
            defaultPhotoFromGoogleAccount: defaultPhotoFromGoogleAccount,
          };
        }
        createUser(uid, newUser);
        navigate("/profile");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  async function handleLogOut(e) {
    e.preventDefault();
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <NavBarBootstrap
        handleAuth={handleGoogleSignIn}
        handleLogOut={handleLogOut}
        user={user}
      ></NavBarBootstrap>
    </div>
  );
}
