import React, { Component } from "react";
import { Route } from "react-router-dom";

import HomePage from "./components/pages/HomePage";
import Court from "./components/pages/Court";

class App extends Component {
  state = {
    courts: []
  };

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={HomePage} />
        <Route path="/join/:access_code" component={Court} />
      </div>
    );
  }
}

export default App;
