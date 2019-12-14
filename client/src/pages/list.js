import React, { Component } from "react";
import {
  Card,
  Button,
  CardBody,
  CardText,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  CardTitle
} from "reactstrap";
import "../style/list.css";
import Cookies from "js-cookie";
import TrelloCard from "./card";
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: this.props.cardData,
      modal: false,
      dropdown: false,
      titleChangeModal: false,
      addCardModal: false
    };
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.titleChangeModalToggle = this.titleChangeModalToggle.bind(this);
    this.addCardModalToggle = this.addCardModalToggle.bind(this);
    this.addCard = this.addCard.bind(this);
    this.deletList = this.deletList.bind(this)
  }

  dropdownToggle() {
    this.setState({ dropdown: !this.state.dropdown });
  }
  titleChangeModalToggle() {
    this.setState({ titleChangeModal: !this.state.titleChangeModal });
  }

  addCardModalToggle() {
    this.setState({ addCardModal: !this.state.addCardModal });
  }

  async handleChangeTitle() {
    const title = await document.getElementById("listTitle").value;
    const response = await fetch(`http://localhost:3000/updateList`, {
      method: "POST",
      body: JSON.stringify({
        title: title,
        boardId: this.props.boardId,
        listId: this.props.listId
      }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await this.titleChangeModalToggle();
    await this.props.getData();
  }

  async addCard() {
    const title = await document.getElementById("cardContent").value;
    console.log(title)
    const response = await fetch(`http://localhost:3000/addCard`, {
      method: "POST",
      body: JSON.stringify({
        content: title,
        boardId: this.props.boardId,
        listId: this.props.listId
      }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await this.addCardModalToggle();
    await this.props.getData();
  }

  async deletList(){
    const response = await fetch(`http://${process.env.url}:3000/deleteList`, {
      method: "POST",
      body: JSON.stringify({
        boardId: this.props.boardId,
        listId: this.props.listId
      }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await this.props.getData();
  }
  componentDidMount() {
    console.log(this.state.cardData);
  }
  render() {
    const { title, listId, cardData ,getData} = this.props;
    return (
      <div>
        <Card className="addCard" key={listId}>
          <CardBody>
            <CardTitle>
              <Row>
                <Col xs="11">
                  <div
                    className="listTitle"
                    id={listId}
                    name={listId}
                    onChange={this.handleChangeTitle}
                  >
                    {this.props.title}
                  </div>
                </Col>{" "}
                <Dropdown
                  isOpen={this.state.dropdown}
                  toggle={this.dropdownToggle}
                  size="sm"
                >
                  <DropdownToggle caret></DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={this.titleChangeModalToggle}>
                      제목수정
                    </DropdownItem>
                    <DropdownItem onClick={this.deletList}>리스트삭제</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Row>
            </CardTitle>
          </CardBody>
          <Col xs="12">
            {cardData.map(card => (
              <TrelloCard boardId={this.props.boardId} listId={this.props.listId} cardId={card._id}content={card.content} getData={getData}></TrelloCard>
            ))}
          </Col>
          <Row>
            <Col xs="1" xs={{ size: 6, offset: 1 }}>
              {" "}
              <button
                onClick={this.addCardModalToggle}
                xs={{ size: 12, offset: 2 }}
              >
                +Add a card
              </button>
            </Col>
          </Row>
        </Card>
        <Modal
          isOpen={this.state.titleChangeModal}
          toggle={this.titleChangeModalToggle}
        >
          <ModalBody>
            <Input
              defaultValue={title}
              id="listTitle"
              type="textarea"
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleChangeTitle}>
              update
            </Button>
            <Button color="primary" onClick={this.titleChangeModalToggle}>
              close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.addCardModal}
          toggle={this.addCardModalToggle}
        >
          <ModalBody>
            <Input id="cardContent" type="textarea" rows={5} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addCard}>
              add card
            </Button>
            <Button color="primary" onClick={this.addCardModalToggle}>
              close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default List;
