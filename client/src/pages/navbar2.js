import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import "../style/Home.css";
import { Link,Redirect } from "react-router-dom";
import Cookies from "js-cookie";

class Navbar2 extends Component {
    constructor(props){
        super(props)
        this.signout=this.signout.bind(this)
    }
    signout(){
        Cookies.remove('token')
        this.props.history.push('/')   }

  render() {
    return (
      <div>
        <Row className="nav">
          <Col className="nav-title" xs={2}>
          <h1>task manager</h1>
          </Col>
          <Col className="button-wrapper" xs="1" xs={{ size: 3, offset: 7 }}>
          <Link to="/board">
            <Button className="button" size="lg">board</Button>
            </Link>
             <Link to="/mypage">
            <Button className="button" size="lg">mypage</Button>
            </Link>
              <Button onClick ={this.signout}className="button" size="lg">
                logout
              </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Navbar2;
