import React, { Component } from "react";
import Booking from "./Booking";

class BookingSet extends Component {
    render() {
        return (
            <div>
                <img src={this.props.kart_img} alt={"kart" + this.props.bookings[0].kart_type} className="kart_img"></img>
                <p>Kart n°{this.props.bookings[0].kart}</p>
                {this.props.bookings.map((booking) =>
                    <Booking booking={booking} update={this.props.update} />
                )}
            </div>
        );
    }
}

export default BookingSet;