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
        Cookies.remove('XSRF-TOKEN')
        Cookies.remove('_csrf')
        this.props.history.push('/')   }

  render() {
    return (
      <div>
        <Row className="nav">
          <Col className="nav-title" xs={2}  >
          <h1>task manager</h1>
          </Col>
          <Col className="button-wrapper" xs={{ size: 1, offset: 7 }} xs={{ size: 1, offset: 7 }}>
          <Link to="/board">
            <Button className="button"  size="lg" block>board</Button>
            </Link>
            </Col>
            <Col className="button-wrapper" xs={{ size: 1 }} xs={{ size: 1 }}>
             <Link to="/mypage">
            <Button className="button" size="lg" block >mypage</Button>
            </Link>
            </Col>
            <Col className="button-wrapper" xs={{ size: 1 }} xs={{ size: 1 }}>
              <Button onClick ={this.signout}className="button" size="lg" block>
                logout
              </Button>
              </Col>
        </Row>
      </div>
    );
  }
}

export default Navbar2;
