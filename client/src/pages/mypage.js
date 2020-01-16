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
import Navbar2 from "./navbar2";

import Cookies from "js-cookie";
import "../style/mypage.css";

class Mypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      email: "",
      passwordCheck: "",
      passwordChangeButton: true
    };
    this.getuserInfo = this.getuserInfo.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handlePasswordCheck = this.handlePasswordCheck.bind(this);
    this.handlePasswordMatch = this.handlePasswordMatch.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  componentDidMount() {
    this.getuserInfo();
  }

  async getuserInfo() {
    let response = await fetch(`http://${process.env.url}:3000/getuser`, {
      method: "GET",
      headers: { "x-access-token": `${Cookies.get("token")}` }
    });
    const data = await response.json();
    console.log(data);
    await this.setState({ id: data.userName, email: data.email });
  }

  async handlePassword(password) {
    await this.setState({ password: password });
    if (
      this.state.password === this.state.passwordCheck &&
      this.state.passwordCheck !== ""
    ) {
      this.setState({ passwordChangeButton: false });
    } else {
      this.setState({ passwordChangeButton: true });
    }
  }

  async handlePasswordCheck(password) {
    await this.setState({ passwordCheck: password });
    if (
      this.state.password === this.state.passwordCheck &&
      this.state.passwordCheck !== ""
    ) {
      this.setState({ passwordChangeButton: false });
    } else {
      this.setState({ passwordChangeButton: true });
    }
  }

  handlePasswordMatch() {
    if (
      this.state.password !== "" &&
      this.state.password === this.state.passwordCheck
    ) {
      return <Col xs={{ size: 4 }}>비밀번호가 일치합니다</Col>;
    } else {
      return <Col xs={{ size: 4 }}>비밀번호를 확인하세요 </Col>;
    }
  }

  async handleChangePassword() {
    let response = await fetch(
      `http://${process.env.url}:3000/updatePassword`,
      {
        method: "POST",
        body: JSON.stringify({ password: this.state.password }),
        headers: {
          "x-access-token": `${Cookies.get("token")}`,
          "Content-Type": "application/json"
        }
      }
    );
    let data = await response.json();
    if ((data.isPasswordChange = "success")) {
      alert("password changed");
    }
    document.getElementById("newpassword").value = "";
    document.getElementById("newpasswordCheck").value = "";
  }
  render() {
    return (
      <div>
        <Navbar2 history={this.props.history}></Navbar2>
        <Container>
          <Row className="Row1"></Row>
          <Col
            className="singUp-containter"
            xs="10"
            xs={{ size: 6, offset: 3 }}
          >
            <Col className="Row2"></Col>
            <Col className="Row2" xs={{ size: 5, offset: 4 }} xs={{ size: 5, offset: 4 }}>
              <h5 className="font">mypage</h5>
            </Col>
            <Form>
              <FormGroup row>
                <Label for="exampleEmail" sm={4} sm={4}>
                  ID
                </Label>
                <Col sm={7} sm={7}>
                  <Input
                    className="input1"
                    type="email"
                    name="email"
                    id="exampleEmail"
                    value={this.state.id}
                  />
                </Col>
                <Row className="Row1"></Row>
                <Label for="exampleEmail" sm={4} sm={4}>
                  e-mail
                </Label>
                <Col sm={7} sm={7}>
                  <Input
                    className="input1"
                    type="email"
                    name="email"
                    id="exampleEmail"
                    value={this.state.email}
                  />
                </Col>
                <Row className="Row1"></Row>
                <Label for="exampleEmail" sm={4} sm={4}>
                  new password
                </Label>
                <Col sm={7} sm={7}>
                  <Input
                    className="input1"
                    type="password"
                    name="newpassword"
                    id="newpassword"
                    placeholder="input newpassword"
                    onChange={e => this.handlePassword(e.target.value)}
                  />
                </Col>
                <Row className="Row1"></Row>

                <Label for="exampleEmail" sm={4} sm={4}>
                  checkpassword
                </Label>
                <Col sm={7} sm={7}>
                  <Input
                    className="input1"
                    type="password"
                    name="newpassword"
                    id="newpasswordCheck"
                    placeholder="input newpassword again"
                    onChange={e => this.handlePasswordCheck(e.target.value)}
                  />
                </Col>
              </FormGroup>
              <Row>
                {this.handlePasswordMatch()}
                <Col xs={{ size: 4, offset: 8 }}>
                  <Button
                    size="sm"
                    onClick={this.handleChangePassword}
                    disabled={this.state.passwordChangeButton}
                  >
                    비밀번호변경
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Container>
      </div>
    );
  }
}

export default Mypage;
