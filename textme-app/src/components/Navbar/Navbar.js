import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import Karts from "../Karts/Karts";
import Authentication from "../Authentication/Authentication";
import Bookings from "../Bookings/Bookings";


class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authText: "Log out"
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/">My bookings</Link>
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
                        <Route exact path="/" render={() => (
                            !this.props.loggedIn ? (<Redirect to="/auth" />
                            ) : (<Bookings user_id={this.props.user.id} />)
                        )} />
                        <Route exact path="/karts" render={() => (
                            !this.props.loggedIn ? (<Redirect to="/auth" />
                            ) : (<Karts />)
                        )} />
                        <Route exact path="/auth" render={() => (
                            this.props.loggedIn ? (<Redirect to="/" />
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