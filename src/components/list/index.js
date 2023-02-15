import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import "components/list/styles.css";
import { Heart } from "react-bootstrap-icons";

function ListItem(props) {
  return (
    <div>
      <Container className=" bg-white p-3 my-2 shadow-sm border position-relative">
        <Row xs={2} sm={2}>
          <Col className="my-auto" xs="2" sm="1">
            <Image
              className="diferent-size"
              src={props.postData.photoURL}
              alt="user icon"
              roundedCircle
            ></Image>
          </Col>
          <Col className="my-auto" xs="10" sm="11">
            <p className="my-0">{props.postData.username}</p>
          </Col>
        </Row>
        <Row className="ms-2">
          <Col>
            <p>{props.postData.date}</p>
          </Col>
        </Row>
        <Row className="ms-2 mb-3">
          <Col>
            <h4>{props.postData.title}</h4>
          </Col>
        </Row>
        <Row xs="auto" className="ms-2">
          <Col className="pe-2">
            <Heart></Heart>
          </Col>
          <Col className="ps-0">
            <p>{props.postData.likes} Likes</p>
          </Col>
        </Row>
        <Link
          to={"/post/" + props.postData.id}
          // To make this Container clickeable without change the style of Container
          /*           
              These styles make the same
              style={{
                position: "absolute",
                right: "0",
                left: "0",
                top: "0",
                bottom: "0",
              }} */
          className="stretched-link"
        ></Link>
      </Container>
    </div>
  );
}

export default function List({ list }) {
  return (
    <Container className="lists">
      {list.map((post) => {
        return <ListItem key={post.id} postData={post}></ListItem>;
      })}
    </Container>
  );
}
