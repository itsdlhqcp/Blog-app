import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "components/categories/styles.css";

export default function Categories() {
  const currentUrl = useLocation();
  return (
    <div>
      <Container className="bg-light px-0 pb-1 pt-2 border-bottom" fluid>
        <div className="container-btn-position">
          <Nav variant="pills" activeKey={currentUrl.pathname}>
            <Nav.Item>
              <Nav.Link eventKey="/" as={Link} to="/">
                Relevant
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="/latest" as={Link} to="/latest">
                Latest
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </Container>
      <p></p>
    </div>
  );
}
