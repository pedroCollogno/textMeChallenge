import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import Karts from "../Karts/Karts";
import Authentication from "../Authentication/Authentication";
import Bookings from "../Bookings/Bookings";
import Account from "../Account/Account";


class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authText: "My account"
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/bookings">My bookings</Link>
                        </li>
                        <li>
                            <Link to="/karts">Book a kart</Link>
                        </li>
                        <li>
                            <Link to="/auth">{this.state.authText}</Link>
                        </li>
                    </ul>

                    <hr />
                    <Switch>
                        <Route exact path="/bookings" render={() => (
                            !this.props.loggedIn ? (<Redirect to="/auth" />
                            ) : (<Bookings user_id={this.props.user.id} />)
                        )} />
                        <Route exact path="/account" render={() => (
                            !this.props.loggedIn ? (<Redirect to="/auth" />
                            ) : (<Account user={this.props.user} updateBalance={this.props.updateBalance} />)
                        )} />
                        <Route exact path="/karts" render={() => (
                            !this.props.loggedIn ? (<Redirect to="/auth" />
                            ) : (<Karts user_id={this.props.user.id} user_balance={this.props.user.balance} updateBalance={this.props.updateBalance} />)
                        )} />
                        <Route exact path="/auth" render={() => (
                            this.props.loggedIn ? (<Redirect to="/account" />
                            ) : (<Authentication authenticate={this.props.authenticate} />)
                        )} />
                        <Route render={() => (
                            !this.props.loggedIn ? (<Redirect to="/auth" />
                            ) : (<Bookings user_id={this.props.user.id} />)
                        )} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default Navbar;