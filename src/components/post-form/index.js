import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import "components/post-form/styles.css";

export default function PostForm({
  handleChangePhoto,
  srcImg,
  handleChangeTitle,
  handleChangeTextBody,
  handleSubmit,
  title,
  textBody,
  isDisabled,
}) {
  // To make a textarea autoresize
  function handleKeyDown(e) {
    // To avoid jump to the top when arrow down is pressed at the bottom of textarea
    if (e.key !== "ArrowDown" && !e.ctrlKey) {
      e.target.style.height = "inherit";
      e.target.style.height = `${e.target.scrollHeight}px`;
      // To correctly jumpt to the top or bottom when press ctrl + Home or ctrl + end
    } else if (e.key === "End" && e.ctrlKey) {
      const container = document.querySelector(".container-title-textarea");
      container.scrollTop = container.scrollHeight;
    } else if (e.key === "Home" && e.ctrlKey) {
      const container = document.querySelector(".container-title-textarea");
      container.scrollTop = 0;
    }
  }

  return (
    <>
      <Form
        className="bg-white border border-2 p-3 post-form rounded-3"
        onSubmit={handleSubmit}
      >
        <Row className="container-title-textarea">
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              onChange={handleChangeTitle}
              value={title}
              type="text"
              placeholder="New post title here..."
              required
              maxLength="70"
            />
            <Form.Text className="text-muted">Max 70 characters</Form.Text>
          </Form.Group>
          <Row xs={1} sm={1}>
            <Col className="my-auto mx-auto" sm="auto" xs="auto">
              <div className="p-0 m-0 position-relative post-form-container-imgProfileSrc">
                <Image
                  className="imgProfile-post"
                  src={srcImg ? srcImg : ""}
                ></Image>
              </div>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="photo-of-profile">
                <Form.Label>Photo</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handleChangePhoto}
                    name="imgProfileSrc"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2" controlId="formtextBody">
            <Form.Label>Text body</Form.Label>
            <Form.Control
              className="textarea-post-from pb-3 mb-3"
              as="textarea"
              rows={3}
              placeholder="Write your post content here..."
              required
              onKeyDown={handleKeyDown}
              onChange={handleChangeTextBody}
              value={textBody}
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3 mt-2 border-top" controlId="formCheckbox">
          <Form.Check
            type="checkbox"
            label="Check to prove you are not a robot"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isDisabled}>
          {isDisabled ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Loading...
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
      </Form>
    </>
  );
}
