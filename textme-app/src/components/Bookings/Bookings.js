import React, { Component } from "react";
import { get_user_bookings } from "../../service/HttpRequests";

class Bookings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: []
        }
        this.getBookings = this.getBookings.bind(this);
    }

    getBookings() {
        get_user_bookings(this.props.user_id)
            .then((res) => {
                this.setState({ bookings: res.data });
            });
    }
    componentWillReceiveProps(newProps) {
        if (this.props !== newProps) {
            this.getBookings();
        }
    }

    render() {
        if (this.state.bookings === []) {
            return (<p>You have no coming reservation</p>)
        }
        return (<ul>
            {this.state.bookings.map((booking) =>
                <li>Kart n°{booking.kart} from {booking.beginning_time} to {booking.end_time}</li>
            )}
        </ul>)
    }
}

export default Bookings;