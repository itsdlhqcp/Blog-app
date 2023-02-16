import { useState } from "react";
import NavBarBootstrap from "components/nav-bar";
import ModalNotification from "components/modal-notification/index";
import { useUserAuth } from "context/user-auth-context";
import { useNavigate } from "react-router-dom";
import {
  getUserByUid,
  existUsername,
  createUserAllData,
} from "services/firebase/firebase";

export default function Header() {
  const { signInWithGoogle, logOut, user, fetchUserData } = useUserAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false); // Login Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false); // LogOut Modal

  async function handleGoogleSignIn(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithGoogle();
      const uid = userCredential.user.uid;
      const photoURL = userCredential.user.photoURL;
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
            isUsernameTaken = await existUsername(tempUsername);
          }
          newUser = {
            uid: uid,
            username: tempUsername,
            photoURL: photoURL,
          };
        } else {
          newUser = {
            uid: uid,
            username: username,
            photoURL: photoURL,
          };
        }

        try {
          await createUserAllData(uid, newUser);
          await fetchUserData(uid);
          navigate("/profile");
        } catch (error) {
          alert(error.message);
          return;
        }
      }
      setShowLoginModal(true);
    } catch (error) {
      console.error(error.message);
    }
  }
  async function handleLogOut(e) {
    e.preventDefault();
    try {
      await logOut();
      navigate("/");
      setShowLogoutModal(true);
    } catch (error) {
      console.error(error.message);
    }
  }

  function handleCloseLogin() {
    setShowLoginModal(false);
  }

  function handleCloseLogout() {
    setShowLogoutModal(false);
  }

  return (
    <div>
      <ModalNotification
        show={showLoginModal}
        setShow={setShowLoginModal}
        handleClose={handleCloseLogin}
        modalTitle={"Welcome"}
        modalText={`Logged in successfully`}
      ></ModalNotification>
      <ModalNotification
        show={showLogoutModal}
        setShow={setShowLogoutModal}
        handleClose={handleCloseLogout}
        modalTitle={"See you soon"}
        modalText={`You have closed your account`}
      ></ModalNotification>
      <NavBarBootstrap
        handleAuth={handleGoogleSignIn}
        handleLogOut={handleLogOut}
        user={user}
      ></NavBarBootstrap>
    </div>
  );
}
