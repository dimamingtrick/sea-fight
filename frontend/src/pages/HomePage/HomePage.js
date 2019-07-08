import React from "react";
import { Container, Row, Col, Button } from "reactstrap";

const HomePage = ({ history }) => {
  const enterDetails = () => history.push("/player-details");

  return (
    <Container>
      <Row>
        <Col className="text-align-center" sm={{ size: 4, offset: 4 }}>
          <h1>Welcome to sea fight</h1>
        </Col>
      </Row>
      <Row>
        <Col className="text-align-center" sm={{ size: 4, offset: 4 }}>
          <Button color="link" onClick={enterDetails}>
            Start Game
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

// export { socket };
export default HomePage;
