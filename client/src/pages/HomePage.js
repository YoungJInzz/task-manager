import React, { Component } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "../style/Home.css";
import { Link, Redirect } from "react-router-dom";
import Navbar from "./navbar";
import Cookies from "js-cookie";
class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Container fluid>
          <Navbar></Navbar>
          <Row className="back"></Row>
          <Row className="back">
            <Col className="letter" xs="4" xs={{ size: 5, offset: 4 }}>
              <h1 className="letter">Thanks for using task manager </h1>{" "}
            </Col>
          </Row>
        </Container>
        {Cookies.get("token") !== undefined && <Redirect to="/board" />}
      </div>
    );
  }
}

export default HomePage;
