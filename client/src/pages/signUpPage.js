import React, { Component } from "react";
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
  ModalBody,
  ModalFooter
} from "reactstrap";
import "../style/singUp.css";
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      email: "",
      modal: false,
      isId: true,
      confirmPassword: ""
    };
    this.checkDuplication = this.checkDuplication.bind(this);
    this.signUp = this.signUp.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handleConfirmMessage = this.handleConfirmMessage.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  async checkDuplication() {
    const id = document.getElementById("exampleEmail").value;
    const response = await fetch(`http://${process.env.url}:3000/checkId`, {
      method: "POST",
      body: JSON.stringify({ userName: id }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    console.log(data);
    if (data.isUser === true) {
      this.setState({ isId: true });
      alert("존재하는 아이디입니다");
    }
    if (data.isUser === false) {
      this.setState({ isId: false });
      alert("사용가능한 아이디입니다");
    }
  }

  async signUp() {
    const id = document.getElementById("exampleEmail").value;
    const { password, confirmPassword, isId, email } = this.state;
    if (isId === true) {
      alert(" 아이디중복확인을 해주세요");
    } else if (
      password === "" ||
      confirmPassword === "" ||
      password !== confirmPassword
    ) {
      alert("비밀번호를 확인해주세요");
    } else if (email === "") {
      alert("이메일을 확인해주세요");
    } else if (password === confirmPassword && isId === false) {
      const response = await fetch(`http://${process.env.url}:3000/signUp`, {
        method: "POST",
        body: JSON.stringify({
          userName: id,
          password: password,
          email: email
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.signdUp === "success") {
        this.toggle();
      }
    } else {
      alert("비밀번호를 확인해주세요");
    }
  }

  handlePassword(password) {
    this.setState({ password: password });
  }

  handleConfirmPassword(passsword) {
    this.setState({ confirmPassword: passsword });
  }

  handleEmail(email) {
    this.setState({ email: email });
  }
  handleConfirmMessage() {
    const { password, confirmPassword } = this.state;
    if (password !== "" && password === confirmPassword) {
      return <div>비밀번호가 일치합니다.</div>;
    } else if (password != confirmPassword) {
      return <div>비밀번호가 일치하지 않습니다</div>;
    } else {
      return <span></span>;
    }
  }
  toggle() {
    this.setState({ modal: !this.state.modal });
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
            <Col className="Row2"></Col>
            <Col className="Row2" xs="10" xs={{ size: 5, offset: 4 }}>
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
                    name="email"
                    id="exampleEmail"
                    placeholder="ID"
                  />
                </Col>
              </FormGroup>
              <Col xs={{ size: 4, offset: 8 }}>
                <Button size="sm" onClick={this.checkDuplication}>
                  아이디중복확인
                </Button>
              </Col>
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
                    onChange={e => this.handlePassword(e.target.value)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="confirmPassword" sm={4}>
                  confirm Password
                </Label>
                <Col sm={7}>
                  <Input
                    type="password"
                    name="password"
                    id="confirmPassword"
                    placeholder="password"
                    onChange={e => this.handleConfirmPassword(e.target.value)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="email" sm={4}>
                  e-mail
                </Label>
                <Col sm={7}>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={e => this.handleEmail(e.target.value)}
                  ></Input>
                </Col>
              </FormGroup>
              {this.handleConfirmMessage()}
              <Col xs={{ size: 4, offset: 9 }}>
                <Button size="sm" onClick={this.signUp}>
                  Submit
                </Button>
              </Col>
            </Form>
          </Col>
        </Container>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalBody>가입에 성공하였습니다</ModalBody>
          <ModalFooter>
            <Link to="/signIn">
              <Button color="primary" onClick={this.toggle}>
                로그인하기
              </Button>{" "}
            </Link>
            <Link to="/">
              <Button color="secondary" onClick={this.toggle}>
                홈페이지로
              </Button>
            </Link>
          </ModalFooter>
        </Modal>
        {Cookies.get("token") !== undefined && <Redirect to="/board" />}
      </div>
    );
  }
}

export default SignUpPage;
