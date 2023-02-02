import { useUserAuth } from "context/user-auth-context";
import ProfileForm from "components/profile-form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState, useEffect, useRef } from "react";
import {
  setUserProfilePhoto,
  existUsername,
  updateUser,
} from "services/firebase/firebase";
import ModalNotification from "components/modal-notification/index";

export default function Profile() {
  const { user, currenProfileImg, fetchUserData } = useUserAuth();

  const [isDisabled, setIsDisabled] = useState(false); // To avoid to make too request
  const [fileImg, SetFileImg] = useState(undefined);
  const [isUpdated, setIsUpdated] = useState(false);
  const [username, setUsername] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [src, setSrc] = useState(undefined);
  const inputRef = useRef();
  const [show, setShow] = useState(false); // Modal

  useEffect(() => {
    setTitle(user.username);
    setUsername(user.username);
    // if src is true, then it has an image src and doesn't need to get the currenProfileImg because currenProfileImg will be updated to current src
    setSrc((src) => (src ? src : currenProfileImg));
  }, [user, currenProfileImg]);

  useEffect(() => {
    if (isUpdated) {
      async function updated() {
        await fetchUserData(user.uid);
      }
      updated();
      setShow(true);
      setIsUpdated(false);
      if (inputRef.current) inputRef.current.value = null;
    }
  }, [handleSubmit && isUpdated]);

  function handleClose() {
    setShow(false);
  }

  function handleChangeUsername(e) {
    setUsername(e.target.value);
  }

  function handleChangePhoto(event) {
    let reader = new FileReader();
    reader.onload = (e) => {
      setSrc(e.target.result);
    };
    SetFileImg(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  }

  async function handleSubmit(e) {
    if (username === "") return;
    if (username === user.username && fileImg === undefined) {
      setIsDisabled(false);
      return;
    }

    const usernameTakenUid = await existUsername(username);
    if (usernameTakenUid && usernameTakenUid !== user.uid) {
      setIsDisabled(false);
      return;
    }

    // Only img changed and maybe defaultPhotoFromGoogleAccount to false
    if (
      usernameTakenUid &&
      usernameTakenUid === user.uid &&
      fileImg !== undefined
    ) {
      setUserProfilePhoto(user.uid, fileImg);
      updateUser(user.uid, {
        uid: user.uid,
        username: username,
        defaultPhotoFromGoogleAccount:
          user.defaultPhotoFromGoogleAccount === false
            ? user.defaultPhotoFromGoogleAccount
            : false,
      });
      setIsUpdated(true);
      setIsDisabled(false);
      return;
    }

    // Only username changed
    if (
      !usernameTakenUid &&
      usernameTakenUid !== user.uid &&
      fileImg === undefined
    ) {
      updateUser(user.uid, {
        uid: user.uid,
        username: username,
        defaultPhotoFromGoogleAccount: user.defaultPhotoFromGoogleAccount,
      });
      setIsUpdated(true);
      setIsDisabled(false);
      return;
    }

    // Both changed
    if (
      !usernameTakenUid &&
      usernameTakenUid !== user.uid &&
      fileImg !== undefined
    ) {
      setUserProfilePhoto(user.uid, fileImg);
      updateUser(user.uid, {
        uid: user.uid,
        username: username,
        defaultPhotoFromGoogleAccount:
          user.defaultPhotoFromGoogleAccount === false
            ? user.defaultPhotoFromGoogleAccount
            : false,
      });

      setIsUpdated(true);
      setIsDisabled(false);
      return;
    }
  }

  return (
    <div>
      {username === undefined || src === undefined || title === undefined ? (
        <div>Loading</div>
      ) : (
        <>
          <ModalNotification
            show={show}
            setShow={setShow}
            handleClose={handleClose}
            modalTitle={"Profile updated"}
            modalText={"The profile has been successfully updated"}
          ></ModalNotification>
          <Container className="user-form pt-3">
            <Row>
              <Col>
                <h2>Welcome @{title}</h2>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <ProfileForm
                  handleChangeUsername={handleChangeUsername}
                  handleChangePhoto={handleChangePhoto}
                  handleSubmit={handleSubmit}
                  username={username}
                  imgProfileSrc={src}
                  isDisabled={isDisabled}
                  inputRef={inputRef}
                ></ProfileForm>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
}
