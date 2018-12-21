import React, { Component } from 'react';
import Navbar from "./components/Navbar/Navbar"
import { add_to_balance, get_balance } from "./service/HttpRequests";

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: {}
    }
    this.authenticate = this.authenticate.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
  }

  authenticate(user_infos) {
    this.setState({ loggedIn: true, user: user_infos });
  }

  updateBalance(amount) {
    if (amount === 0) {
      get_balance(this.state.user.id)
        .then((res) => {
          this.setState({ user: res.data });
        })
    }
    add_to_balance(this.state.user.id, amount)
      .then((res) => {
        this.setState({ user: res.data });
      })
  }

  render() {
    return (
      <div className="App">
        <Navbar loggedIn={this.state.loggedIn} authenticate={this.authenticate} user={this.state.user}
          updateBalance={this.updateBalance} />
        {this.state.loggedIn && <p>Current user id : {this.state.user.id}</p>}
      </div>
    );
  }
}

export default App;
