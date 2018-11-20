import React, { Component } from "react";
import { Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import HomePage from "./components/pages/HomePage";
import JoinCourt from "./components/pages/JoinCourt";

class App extends Component {
  state = {
    courts: []
  };

  render() {
    return (
      <div className="App">
        <Route path="/" exact component={HomePage} />
        <Route path="/court" exact component={JoinCourt} />
      </div>
    );
  }
}

export default App;
