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
import List from "./list";
import "../style/boardPage.css";

class BoardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardId: "",
      boardInfo: [], //componentdidmount보다 render가 먼저되는데 ''로 설정되서 map이 돌아가지 않았다
      modal: false,
      addListModal: false
    };
    this.getData = this.getData.bind(this);
    this.addListModalToggle = this.addListModalToggle.bind(this);
    this.addList = this.addList.bind(this)
  }
  async componentDidMount() {
    let data = await this.getData();
    await console.log(this.state.boardInfo);
  }

  async getData() {
    const response = await fetch(`http://${process.env.url}:3000/getboard`, {
      method: "POST",
      body: JSON.stringify({ boardId: this.props.match.params.id }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    let data = await response.json();
    this.setState({ boardId: data[0]._id });
    this.setState({ boardInfo: data[0].list });

    return data;
  }

  addListModalToggle() {
    this.setState({ addListModal: !this.state.addListModal });
  }

  async addList(){
    const title =document.getElementById("addList").value
    const response = await fetch(`http://${process.env.url}:3000/addList`, {
      method: "POST",
      body: JSON.stringify({
        boardId: this.state.boardId,
        title: title
      }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await this.addListModalToggle()
    await this.getData()
  }
  render() {
    const { boardInfo, boardId } = this.state;
    return (
      <div>
        <Container fluid>
          <Navbar2 history={this.props.history}></Navbar2>
        </Container>
        <Container fluid>
          <Row>
            {boardInfo.map(list => (
              <Col xs="3">
                <List
                  title={list.title}
                  boardId={boardId}
                  listId={list._id}
                  getData={this.getData}
                  cardData={list.card}
                />
              </Col>
            ))}
            <Col xs="3">
              <div onClick={this.addListModalToggle}>
              <Card  className="addCardButton">
                <CardBody>리스트추가</CardBody>
              </Card>
              </div>
            </Col>
          </Row>
        </Container>

        <Modal
          isOpen={this.state.addListModal}
          toggle={this.addListModalToggle}
        >
          <ModalBody>
            <Input id="addList" type="textarea" rows={5} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addList}>
              add list
            </Button>
            <Button color="primary" onClick={this.addListModalToggle}>
              close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default BoardList;
