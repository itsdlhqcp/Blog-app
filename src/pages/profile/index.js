import { useUserAuth } from "context/user-auth-context";
import ProfileForm from "components/profile-form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useState, useEffect, useRef } from "react";
import {
  setUserProfilePhoto,
  existUsername,
  downloadUserProfilePhoto,
  updateUserAllData,
} from "services/firebase/firebase";
import ModalNotification from "components/modal-notification/index";
import Loading from "components/loading";

export default function Profile() {
  const { user, fetchUserData } = useUserAuth();

  const [isDisabled, setIsDisabled] = useState(false); // To avoid to make too request
  const [fileImg, SetFileImg] = useState(undefined);
  const [isUpdated, setIsUpdated] = useState(false);
  const [username, setUsername] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [src, setSrc] = useState(undefined);
  const inputRef = useRef();
  const [show, setShow] = useState(false); // Modal
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(user.username);
    setUsername(user.username);
    setSrc(user.photoURL);
  }, [user]);

  useEffect(() => {
    if (isUpdated) {
      async function updated() {
        await fetchUserData(user.uid);
      }
      updated();
      setShow(true);
      setIsUpdated(false);
      setIsDisabled(false);
      if (inputRef.current) {
        inputRef.current.value = null;
        SetFileImg(undefined);
      }
    }

    if (error) {
      setSrc(() => user.photoURL);
      setUsername(user.username);
      setIsDisabled(false);
      if (inputRef.current) {
        inputRef.current.value = null;
        SetFileImg(undefined);
      }
    }
  }, [handleSubmit && isUpdated, handleSubmit && error !== ""]);

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
    e.preventDefault();
    setIsDisabled(true);
    setError("");
    if (username.trim() === "") {
      setError("Add a valid username");
      setIsDisabled(false);
      return;
    }
    if (username === user.username && fileImg === undefined) {
      setIsDisabled(false);
      return;
    }

    // Offline error
    if (!navigator.onLine) {
      setError("Something wrong, check your network connection");
      setIsDisabled(false);
      return;
    }

    const usernameTakenUid = await existUsername(username);

    if (usernameTakenUid && usernameTakenUid !== user.uid) {
      setError("The username is taken");
      setIsDisabled(false);
      return;
    }

    // Only img changed and photoURL of user
    if (
      usernameTakenUid &&
      usernameTakenUid === user.uid &&
      fileImg !== undefined
    ) {
      await setUserProfilePhoto(user.uid, fileImg).then((res) => {
        if (res) {
          downloadUserProfilePhoto(user.uid)
            .then((downloadURL) => {
              updateUserAllData(user.uid, {
                uid: user.uid,
                username: username.trim(),
                photoURL: downloadURL,
              })
                .then(() => {
                  setIsUpdated(true);
                })
                .catch(() => setError("Someghing wrong, try again"));
            })
            .catch(() => {
              setError("Someghing wrong, try again");
            });
        } else {
          setError(
            "Something wrong, the image must be less than 1mb and must be png, svg or jpg"
          );
        }
      });
      return;
    }

    // Only username changed
    if (
      !usernameTakenUid &&
      usernameTakenUid !== user.uid &&
      fileImg === undefined
    ) {
      try {
        await updateUserAllData(user.uid, {
          uid: user.uid,
          username: username.trim(),
          photoURL: user.photoURL,
        });
        setIsUpdated(true);
        setIsDisabled(false);
        return;
      } catch (error) {
        setIsDisabled(false);
        console.error(error.message);
        setError("Someghing wrong, try again");
        return;
      }
    }

    // Both changed
    if (
      !usernameTakenUid &&
      usernameTakenUid !== user.uid &&
      fileImg !== undefined
    ) {
      await setUserProfilePhoto(user.uid, fileImg).then((res) => {
        if (res) {
          downloadUserProfilePhoto(user.uid)
            .then((downloadURL) => {
              updateUserAllData(user.uid, {
                uid: user.uid,
                username: username.trim(),
                photoURL: downloadURL,
              })
                .then(() => {
                  setIsUpdated(true);
                })
                .catch(() => setError("Someghing wrong, try again"));
            })
            .catch(() => {
              setError("Someghing wrong, try again");
            });
        } else {
          setError(
            "Something wrong, the image must be less than 1mb and must be png, svg or jpg"
          );
        }
      });
      setIsDisabled(false);
      return;
    }
  }

  return (
    <div>
      {username === undefined || src === undefined || title === undefined ? (
        <Loading></Loading>
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
            {error && <Alert variant="danger">{error}</Alert>}
          </Container>
        </>
      )}
    </div>
  );
}
