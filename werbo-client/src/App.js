import React, { Component } from "react";
import { Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import HomePage from "./components/pages/HomePage";
import ViewCourt from "./components/pages/ViewCourt";

class App extends Component {
  state = {
    courts: []
  };

  render() {
    return (
      <div className="App">
        <Route path="/" exact component={HomePage} />
        <Route path="/court" exact component={ViewCourt} />
      </div>
    );
  }
}

export default App;
