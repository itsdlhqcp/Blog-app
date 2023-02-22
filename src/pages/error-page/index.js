import React from "react";
import Container from "react-bootstrap/Container";
import errorPageImg from "assets/img/error-page.jpg";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "pages/error-page/styles.css";

export default function ErrorPage() {
  return (
    <div className="container-error-page">
      <Container className="pt-2 my-auto ">
        <Row>
          <Col className="mx-auto text-center">
            <h2>404 Error</h2>
          </Col>
        </Row>
        <Row>
          <Col className="mx-auto text-center">
            <img
              className="error-page-image"
              src={errorPageImg}
              alt="Woman seeing the horizont"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="mx-auto text-center">
            <Link to="/">
              <Button className="mx-0">Go back home</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
