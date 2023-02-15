import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import "components/profile-form/styles.css";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import userDefaultIcon from "assets/svg/abstract-user-flat-3.svg";

export default function ProfileForm({
  handleChangeUsername,
  handleChangePhoto,
  handleSubmit,
  username,
  imgProfileSrc,
  isDisabled,
  inputRef,
}) {
  return (
    <Form className="bg-white border border-2 p-3">
      <Row>
        <Col>
          <h3>Set profile information</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="profile-username">
            <Form.Label>Username</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="your-username">@</InputGroup.Text>
              <Form.Control
                aria-label="Username"
                aria-describedby="your-username"
                value={username}
                onChange={handleChangeUsername}
                name="username"
                maxLength="70"
              />
            </InputGroup>
            <Form.Text className="text-muted">Max 70 characters</Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row xs={2} sm={2}>
        <Col className="my-auto" sm="auto" xs="auto">
          <div className="p-0 m-0 position-relative container-imgProfileSrc">
            <Image
              src={imgProfileSrc}
              roundedCircle
              style={{
                width: "100%",
                objectFit: "cover",
                height: "100%",
              }} /* STYLE */
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = userDefaultIcon;
              }}
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
                ref={inputRef}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end">
          <Button
            variant="outline-secondary"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
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
              <>Save changes</>
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
