import React, { Component } from "react";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cashAmount: 5
        }
        this.changeAmount = this.changeAmount.bind(this);
        this.addCash = this.addCash.bind(this);
    }

    changeAmount(e) {
        this.setState({ cashAmount: e.target.value });
    }

    addCash() {
        this.props.updateBalance(this.state.cashAmount);
    }

    render() {
        return (<div>
            <p>{this.props.user.email}</p>
            <p>Your current balance : {this.props.user.balance} $</p>
            <label>
                <span>Add </span>
                <input type="number" value={this.state.cashAmount} onChange={this.changeAmount} />
                <span> $</span>
            </label>
            <button onClick={this.addCash}>Add cash !</button>
        </div>)
    }
}

export default Account;