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
  Input
} from "reactstrap";
import "../style/board.css";
import Cookies from "js-cookie";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      dropdown: false
    };
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.deleteBoard = this.deleteBoard.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.openBoard = this.openBoard.bind(this);
  }

  dropdownToggle() {
    this.setState({ dropdown: !this.state.dropdown });
  }

  modalToggle() {
    this.setState({ modal: !this.state.modal });
  }

  async deleteBoard() {
    const response = await fetch(`http://${process.env.url}:3000/deleteBoard`, {
      method: "POST",
      body: JSON.stringify({ boardId: this.props.id }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await console.log(this.props.id);
    await this.props.getboard();
  }

  async updateBoard() {
    const title = document.getElementById("inputBoardTitle").value;
    const response = await fetch(`http://${process.env.url}:3000/updateBoard`, {
      method: "POST",
      body: JSON.stringify({ boardId: this.props.id, title: title }),
      headers: {
        "x-access-token": `${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    });
    await this.modalToggle();
    await this.props.getboard();
  }

  openBoard() {
    this.props.history.push(`/boardPage/${this.props.id}`);
  }
  render() {
    const { title, id, getboard } = this.props;
    return (
      <div>
        <Card color="success" className="boardButton" key={id}>
          <CardBody onClick={this.openBoard}>
            <CardText>{title} </CardText>
          </CardBody>
          <Col xs="1" xs={{ size: 1, offset: 9 }}>
            {" "}
            <Dropdown
              isOpen={this.state.dropdown}
              toggle={this.dropdownToggle}
              size="sm"
            >
              <DropdownToggle caret></DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.deleteBoard}>삭제</DropdownItem>
                <DropdownItem onClick={this.modalToggle}>수정</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Card>

        <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
          <ModalBody>
            <Input
              defaultValue={title}
              id="inputBoardTitle"
              type="textarea"
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBoard}>
              update
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

export default Board;
