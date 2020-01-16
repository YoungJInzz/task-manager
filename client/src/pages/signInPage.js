import React, { Component } from "react";
import Cookies from "js-cookie";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import "../style/singUp.css";
import { Link, Redirect } from "react-router-dom";
class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isId: ""
    };
    this.handleSignin = this.handleSignin.bind(this);
  }

  async handleSignin() {
    const email = document.getElementById("exampleEmail").value;
    const password = document.getElementById("examplePassword").value;
    const token = await fetch(`http://${process.env.url}:3000/getCSRF`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    let x = await token.json()
    console.log(x);
    const response = await fetch(`http://${process.env.url}:3000/signIn`, {
      method: "POST",
      // credentials: 'include',
      body: JSON.stringify({ userName: email, password: password }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    if (data.isId === "falseId") {
      alert("존재하지 않는 아이디입니다");
    } else if (data.isId === "falsePassword") {
      alert("잘못된 비밀번호입니다.");
    } else if (data.isId === "true") {
      Cookies.set("token", data.token, { expires: 1, path: "/" });
      this.props.history.push("/board");
    }
  }
  render() {
    return (
      <div>
        <Container>
          <Row className="Row1"></Row>
          <Col
            className="singUp-containter"
            xs="10"
            xs={{ size: 6, offset: 3 }}
          >
            <Col className="signUpRow2"></Col>
            <Col className="signUpRow2" xs="10" xs={{ size: 5, offset: 4 }}>
              <h5 className="font">sign up to trello</h5>
            </Col>
            <Form>
              <FormGroup row>
                <Label for="exampleEmail" sm={4}>
                  ID
                </Label>
                <Col sm={7}>
                  <Input
                    className="input1"
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="ID"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="examplePassword" sm={4}>
                  Password
                </Label>
                <Col sm={7}>
                  <Input
                    type="password"
                    name="password"
                    id="examplePassword"
                    placeholder="password"
                  />
                </Col>
              </FormGroup>
              <Col xs={{ size: 4, offset: 9 }}>
                <Button size="sm" onClick={this.handleSignin}>
                  Submit
                </Button>
              </Col>
            </Form>
          </Col>
        </Container>
        {/* <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalBody>가입에 성공하였습니다</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              로그인하기
            </Button>{" "}
            <Link to="/">
              <Button color="secondary" onClick={this.toggle}>
                홈페이지로
              </Button>
            </Link>
          </ModalFooter>
        </Modal> */}
        {Cookies.get("token") !== undefined && <Redirect to="/board" />}
      </div>
    );
  }
}

export default SignInPage;
