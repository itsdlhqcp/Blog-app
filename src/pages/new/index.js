import { useUserAuth } from "context/user-auth-context";
import PostForm from "components/post-form";
import Container from "react-bootstrap/Container";
import "pages/new/styles.css";
import { useState } from "react";
import {
  createPost,
  setPostPhoto,
  downloadPostPhoto,
} from "services/firebase/firebase";
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import Alert from "react-bootstrap/Alert";
import ModalNotification from "components/modal-notification/index";

export default function NewPost() {
  const { user } = useUserAuth();

  const [isDisabled, setIsDisabled] = useState(false); // To avoid to make too request
  const [fileImg, SetFileImg] = useState(undefined);
  const [textBody, setTextBody] = useState("");
  const [title, setTitle] = useState("");
  const [srcImg, setSrcImg] = useState(false);
  const [show, setShow] = useState(false); // Modal
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleClose() {
    setShow(false);
    navigate("/");
  }

  function handleChangeTitle(e) {
    setTitle(e.target.value);
  }

  function handleChangeTextBody(e) {
    setTextBody(e.target.value);
  }

  function handleChangePhoto(event) {
    let reader = new FileReader();
    reader.onload = (e) => {
      setSrcImg(e.target.result);
    };
    SetFileImg(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Offline error
    if (!navigator.onLine) {
      setError("Something wrong, check your network connection");
      return;
    }

    // Empty title error
    if (title.trim() === "") {
      setError("Title can't be blank");
      console.log(uniqid(title.trim()));
      return;
    }

    // Empty textBody error
    if (textBody.trim() === "") {
      setError("Text content can't be blank");
      return;
    }

    // Min lenght title error
    if (title.trim().replace(/\ +/g, " ").length < 12) {
      setError("The title must have a minimum of 12 characters");
      return;
    }

    // Min lenght text content error
    if (textBody.trim().replace(/\ +/g, " ").length < 30) {
      setError("The text content must have a minimum of 30 characters");
      return;
    }

    const postDate = new Date().toString();
    const id = uniqid();
    let newPost = {
      id: id,
      title: title.trim().replace(/\ +/g, " "),
      textBody: textBody.trim().replace(/\ +/g, " "),
      img: srcImg,
      authorUid: user.uid,
      date: postDate,
      likes: 0,
      comments: 0,
    };
    if (fileImg === undefined) {
      createPost(newPost.id, newPost)
        .then(() => setShow(true))
        .catch(() => setError("Something wrong, try again"));
    } else {
      setPostPhoto(newPost.id, fileImg).then((res) => {
        if (res) {
          downloadPostPhoto(newPost.id).then((downloadURL) => {
            newPost.img = downloadURL;
            createPost(newPost.id, newPost)
              .then(() => setShow(true))
              .catch(() => setError("Something wrong, try again"));
          });
        } else {
          setError(
            "Something wrong, the image must be less than 1mb and must be png, svg or jpg"
          );
        }
      });
    }
  }

  return (
    <div>
      <Container className=" mt-2 post-form">
        <ModalNotification
          show={show}
          setShow={setShow}
          handleClose={handleClose}
          modalTitle={"Profile updated"}
          modalText={"The profile has been successfully updated"}
        ></ModalNotification>
        {error && <Alert variant="danger">{error}</Alert>}
        <PostForm
          handleChangeTitle={handleChangeTitle}
          handleChangeTextBody={handleChangeTextBody}
          handleChangePhoto={handleChangePhoto}
          handleSubmit={handleSubmit}
          title={title}
          textBody={textBody}
          srcImg={srcImg}
          isDisabled={isDisabled}
        ></PostForm>
      </Container>
    </div>
  );
}
