import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Button,
} from "reactstrap";

import { connectToGameRequest } from "../../services";

const PlayerDetailsPage = ({ history }) => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNickname = e => {
    setNickname(e.target.value);
    if (error) setError("");
  };

  const findGame = e => {
    e.preventDefault();
    setLoading(true);
    connectToGameRequest(nickname)
      .then(() => {
        localStorage.setItem("nickname", nickname);
        history.push("/game", { nickname });
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <Container>
      <Row>
        <Col sm={{ size: 6, offset: 3 }}>
          <Form onSubmit={findGame}>
            <FormGroup>
              <Label for="nickname">Nickname</Label>
              <Input
                type="text"
                name="nickname"
                id="nickname"
                placeholder="Enter Your Nickname"
                onChange={handleNickname}
              />
            </FormGroup>
            {error && <FormText className="error-message">{error}</FormText>}
            <FormGroup className="d-flex justify-content-center">
              <Button disabled={loading} outline>
                Find Game
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerDetailsPage;
