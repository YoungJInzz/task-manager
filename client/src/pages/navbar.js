import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import "../style/navBar.css";
import { Link, Redirect } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div>
        <Row className="nav">
          <Col className="nav-title" xs={3} xs={3}>
            <h1>task manager</h1>
          </Col>
          <Col className="button-wrapper" xs={{ size: 1, offset: 6 }} xs={{ size: 1, offset: 6 }}>
            <Link to="/signIn">
              <Button className="button" size="lg">
                signIn
              </Button>
            </Link>
          </Col>
          <Col className="button-wrapper" xs={{ size: 1}} xs={{ size: 1}}>
            <Link to="/signUp">
              <Button className="button" size="lg">
                signUp
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Navbar;
