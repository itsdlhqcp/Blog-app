import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { Github, Linkedin } from "react-bootstrap-icons";
import "components/footer/styles.css";
import myLogo from "assets/brand/my-website-logo.png";

export default function Footer() {
  return (
    <>
      <Container className="bg-dark footer py-2">
        <Row className="ms-2">
          <Col>
            Created by{" "}
            <a
              className="footer-social-links"
              href="https://github.com/Luise8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Luis E. Gamez
            </a>
          </Col>
          <Col xs="auto">
            <a
              className="footer-social-links"
              href="https://luisegamez.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={myLogo} alt="Url to my website" />
            </a>
          </Col>
          <Col xs="auto">
            <a
              className="footer-social-links"
              href="https://github.com/Luise8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github></Github>
            </a>
          </Col>
          <Col xs="auto">
            <a
              className="footer-social-links"
              href="https://www.linkedin.com/in/luis-e-gamez-prado/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin></Linkedin>
            </a>
          </Col>
        </Row>
      </Container>
    </>
  );
}
