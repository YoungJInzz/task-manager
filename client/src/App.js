import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./style.css";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/signUpPage";
import SignInPage from "./pages/signInPage";
import BoardList from "./pages/boardList";
import BoardPage from "./pages/boardPage";
import Mypage from "./pages/mypage";
class App extends Component {
  render() {
    return (
      <div>
        {/* <div>dd</div> */}
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/signUp" component={SignUpPage} />
          <Route path="/signIn" render={props => <SignInPage {...props} />} />
          <Route path="/board" render={props => <BoardList {...props} />} />
          <Route
            path="/boardPage/:id"
            render={props => <BoardPage {...props} />}
          />
          <Route path="/mypage" render={props => <Mypage {...props} />} />
        </Switch>
      </div>
    );
  }
}
export default App;
