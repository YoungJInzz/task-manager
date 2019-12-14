import React, { Component } from "react";
import { Card, Button, CardBody, CardText, Row, Col } from "reactstrap";
import "../style/board.css";

class Board extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { title, id } = this.props;
    return (
      <div>
        <Card className="boardButton" key={id}>
          <CardBody>
            <CardText>{title}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Board;
