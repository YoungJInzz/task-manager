import React, { Component } from "react";
import Cookies from "js-cookie";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardText,
  Modal,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
import { Link } from "react-router-dom";
import Navbar2 from "./navbar2";
import Board from "./board";
import "../style/board.css";

class BoardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardInfo: [], //componentdidmount보다 render가 먼저되는데 ''로 설정되서 map이 돌아가지 않았다
      modal: false
    };
    this.toggle = this.toggle.bind(this);
    this.createBoard = this.createBoard.bind(this);
    this.getBoardData = this.getBoardData.bind(this);
  }
  async componentDidMount() {
    await this.getBoardData();
    const data = await response.json();
    await this.setState({ boardInfo: data });
    await console.log(this.state.boardInfo);
  }

  async getBoardData() {
    const response = await fetch(`http://${process.env.url}:3000/boards`, {
      method: "GET",
      headers: {
        "x-access-token": `${Cookies.get("token")}`
      }
    });
    const data = await response.json();
    await this.setState({ boardInfo: data });
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  async createBoard() {
    const title = document.getElementById("inputBoardTitle").value;
    const response = await fetch(`http://${process.env.url}:3000/addBoard`, {
      method: "POST",
      body: JSON.stringify({ title: title }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    this.toggle();
    await this.getBoardData();
  }
  render() {
    const { boardInfo } = this.state;
    return (
      <div>
        <Container fluid>
          <Navbar2 history={this.props.history}></Navbar2>
        </Container>
        <Container>
          <Row className="back">
            {boardInfo.map(board => (
              <Col xs="3">
                <Board
                  history={this.props.history}
                  title={board.title}
                  id={board.id}
                  getboard={this.getBoardData}
                />
              </Col>
            ))}
            <Col xs="3">
              <Card
                color="warning"
                className="boardButton"
                onClick={() => this.toggle()}
              >
                <CardBody>
                  <CardText>make newboard</CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalBody>
            <Input
              id="inputBoardTitle"
              type="textarea"
              placeholder="wirte board title"
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.createBoard}>
              create
            </Button>
            <Button color="primary" onClick={this.toggle}>
              close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default BoardList;
