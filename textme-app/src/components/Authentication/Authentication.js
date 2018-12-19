import React, { Component } from "react";
import { send_register_form, send_log_in_form } from "../../service/HttpRequests";

class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegistering: false,
            email: "",
            password: "",
            wrongPassMessage: ""
        }
        this.switchMode = this.switchMode.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePass = this.onChangePass.bind(this);
        this.onSubmitLogin = this.onSubmitLogin.bind(this);
        this.onSubmitRegister = this.onSubmitRegister.bind(this);
        this.wrongPass = this.wrongPass.bind(this);
    }

    switchMode() {
        this.setState({ isRegistering: !this.state.isRegistering });
    }

    getSwitchText() {
        if (this.state.isRegistering) {
            return "Already have an account ? Log in !";
        }
        return "Don't have an account yet ? Register !";
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    onChangePass(e) {
        this.setState({ password: e.target.value });
    }

    wrongPass() {
        this.setState({ wrongPassMessage: "You entered the wrong password ! Try again." })
    }

    onSubmitLogin(e) {
        console.log("Submit log in");
        e.preventDefault();
        send_log_in_form(this.state.email, this.state.password).then((res) => {
            if (res.data === "Wrong password") {
                this.wrongPass();
            }
            else {
                this.props.authenticate(res.data);
            }
        });
    }

    onSubmitRegister(e) {
        console.log("Submit register");
        e.preventDefault();
        send_register_form(this.state.email, this.state.password)
            .then((res) => {
                this.props.authenticate(res.data);
            });
    }

    render() {
        return (
            <div>
                {this.state.isRegistering &&
                    <form onSubmit={this.onSubmitRegister}>
                        <label>
                            <span>Email :</span>
                            <input type="text" name="email" onChange={this.onChangeEmail} />
                        </label>
                        <label>
                            <span>Password :</span>
                            <input type="password" name="password" onChange={this.onChangePass} />
                        </label>
                        <button type="submit">Register</button>
                    </form>
                }
                {!this.state.isRegistering &&
                    <form onSubmit={this.onSubmitLogin}>
                        <label>
                            <span>Email :</span>
                            <input type="text" name="email" onChange={this.onChangeEmail} />
                        </label>
                        <label>
                            <span>Password :</span>
                            <input type="password" name="password" onChange={this.onChangePass} />
                        </label>
                        <button type="submit">Log in</button>
                    </form>
                }
                <p>{this.state.wrongPassMessage}</p>
                <button onClick={this.switchMode}>{this.getSwitchText()}</button>
            </div>
        );
    }
}

export default Authentication;