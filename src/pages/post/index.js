import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getListUsernameAndPhotoURL,
  getPostById,
  getCount,
  getUserLikes,
  updateLikesData,
} from "services/firebase/firebase";
import { Navigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "pages/post/styles.css";
import { useUserAuth } from "context/user-auth-context";
import Loading from "components/loading";

export default function Post() {
  const { user } = useUserAuth();
  const [post, setPost] = useState(false);
  const [liked, setLiked] = useState(undefined);
  const [likesCount, setLikesCount] = useState(false);

  const postId = useParams().id;
  const isObjectEmpty = (objectName) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

  useEffect(() => {
    if (user === null) {
      async function getPostData() {
        try {
          // Get doc with all of the username and photoURL
          const listUsersData = await getListUsernameAndPhotoURL();

          // Get doc with count of likes of all posts
          const count = await getCount();
          setLikesCount(count[postId]);

          // Get post
          const postData = await getPostById(postId);

          // Get date
          const date = new Date(postData.date);
          const optionsShortDate = { month: "short", day: "numeric" };
          const optionsLongDate = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "2-digit",
            hourCycle: "h24",
          };
          const shortDate = date.toLocaleDateString(
            undefined,
            optionsShortDate
          );
          const longDate = date.toLocaleDateString(undefined, optionsLongDate);

          let finalPost = {
            ...postData,
            username: listUsersData[postData.authorUid].username,
            photoURL: listUsersData[postData.authorUid].photoURL,
            date: longDate,
          };
          // set post with definitve data to render
          setPost(finalPost);
        } catch (error) {
          console.error(error);
        }
      }
      getPostData();
    } else if (user.constructor === Object) {
      if (Object.keys(user).length > 0) {
        async function getPostData() {
          try {
            // Get doc with all of the username and photoURL
            const listUsersData = await getListUsernameAndPhotoURL();

            // Get doc with count of likes of all posts
            const count = await getCount();
            setLikesCount(count[postId]);

            // Get document with likes given by the current user
            const userGivenLikes = await getUserLikes(user.uid);
            const checkLiked = userGivenLikes.hasOwnProperty(postId)
              ? true
              : false;
            console.log(checkLiked);
            setLiked(checkLiked);

            // Get post
            const postData = await getPostById(postId);

            // Get date
            const date = new Date(postData.date);
            const optionsShortDate = { month: "short", day: "numeric" };
            const optionsLongDate = {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "2-digit",
              hourCycle: "h24",
            };
            const shortDate = date.toLocaleDateString(
              undefined,
              optionsShortDate
            );
            const longDate = date.toLocaleDateString(
              undefined,
              optionsLongDate
            );
            let finalPost = {
              ...postData,
              username: listUsersData[postData.authorUid].username,
              photoURL: listUsersData[postData.authorUid].photoURL,
              date: longDate,
            };
            console.log(finalPost);
            // set post with definitve data to render
            setPost(finalPost);
          } catch (error) {
            console.error(error);
          }
        }
        getPostData();
      }
    }
  }, [postId, user]);

  async function handleLikes() {
    if (liked) {
      const newCount = likesCount - 1;
      // (postId, userUid, typeUpdate)
      await updateLikesData(postId, user.uid, liked);
      setLikesCount(newCount);
    } else {
      const newCount = likesCount + 1;
      await updateLikesData(postId, user.uid, liked);
      setLikesCount(newCount);
    }
    setLiked(!liked);
  }

  return (
    <div>
      {post === false || isObjectEmpty(user) ? (
        <Loading></Loading>
      ) : post.id === undefined ? (
        <Navigate to="/"></Navigate>
      ) : (
        <div className="post">
          <Container className="bg-white p-3 post-container">
            <Row>
              <Col>
                <h1 className="text-center">{post.title}</h1>
              </Col>
            </Row>

            <Row xs={2} sm={2}>
              <Col className="p-0 m-0 col-container-img" sm="auto" xs="auto">
                <Image
                  className="post-profilePhoto-diferent-size"
                  src={post.photoURL}
                  alt="user icon"
                  roundedCircle
                ></Image>
              </Col>
              <Col className="my-auto">
                <p className="my-0">{post.username}</p>
              </Col>
            </Row>

            <Row>
              <Col>
                <p>{post.date}</p>
              </Col>
            </Row>

            {/* hero */}
            {post.img && (
              <Row className="mx-auto my-3">
                <Col className="my-auto mx-auto" sm="auto" xs="auto">
                  <div className="container-hero">
                    <Image
                      className="img-fluid"
                      src={post.img}
                      alt="user icon"
                    ></Image>
                  </div>
                </Col>
              </Row>
            )}

            <Row>
              <Col>
                <p>{post.textBody}</p>
              </Col>
            </Row>
            <Row xs="auto" className="ms-2">
              <Col className="my-auto pe-1">
                {user ? (
                  <button
                    className={`button-like m-0 p-0 bg-white ${
                      liked ? "text-danger border-danger" : ""
                    }`}
                    onClick={handleLikes}
                  >
                    <span className=" h-100 p-0 m-0">icon</span>
                  </button>
                ) : (
                  <div className={`button-like m-0 p-0 bg-white`}>
                    <span className=" h-100 p-0 m-0">icon</span>
                  </div>
                )}
              </Col>
              <Col className="ps-0 my-auto">
                <p className="my-auto">{likesCount}</p>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
}
