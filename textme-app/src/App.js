import React, { Component } from 'react';
import Navbar from "./components/Navbar/Navbar"

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: {}
    }
    this.authenticate = this.authenticate.bind(this);
  }

  authenticate(user_infos) {
    this.setState({ loggedIn: true, user: user_infos });
  }

  render() {
    return (
      <div className="App">
        <Navbar loggedIn={this.state.loggedIn} authenticate={this.authenticate} user={this.state.user} />
        {this.state.loggedIn && <p>User is {this.state.user.id}</p>}
      </div>
    );
  }
}

export default App;
