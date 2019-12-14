import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardText,
  Button,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
import "../style/card.css";
import Cookies from "js-cookie";

class TrelloCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.modalToggle = this.modalToggle.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
  }

  modalToggle() {
    this.setState({ modal: !this.state.modal });
  }

  async updateCard() {
    const content = await document.getElementById("cardContent").value;
    console.log(this.props.boardId, this.props.listId, this.props.cardId);
    const response = await fetch(`http://${process.env.url}:3000/updateCard`, {
      method: "POST",
      body: JSON.stringify({
        content: content,
        boardId: this.props.boardId,
        listId: this.props.listId,
        cardId: this.props.cardId
      }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await this.modalToggle();
    await this.props.getData();
  }

  async deleteCard() {
    const response = await fetch(`http://${process.env.url}:3000/deleteCard`, {
      method: "POST",
      body: JSON.stringify({
        boardId: this.props.boardId,
        listId: this.props.listId,
        cardId: this.props.cardId
      }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await this.modalToggle();
    await this.props.getData();
  }
  render() {
    const { boardId, listId } = this.props;

    return (
      <div>
        <Card onClick={this.modalToggle} className="cards" id={this.props.id}>
          <CardBody>
            <CardText>{this.props.content}</CardText>
          </CardBody>
        </Card>

        <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
          <ModalBody>
            <Input
              defaultValue={this.props.content}
              id="cardContent"
              type="textarea"
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateCard}>
              update
            </Button>
            <Button color="primary" onClick={this.deleteCard}>
              delete
            </Button>
            <Button color="primary" onClick={this.modalToggle}>
              close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TrelloCard;
