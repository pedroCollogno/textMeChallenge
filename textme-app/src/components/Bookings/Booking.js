import React, { Component } from "react";
import DateTime from "react-datetime";
import moment from "moment";
import "../Karts/DateTime.css";

import { modify_booking, delete_booking } from "../../service/HttpRequests";

class Booking extends Component {
    constructor(props) {
        super(props);
        let init_moment = moment();
        init_moment.format("YYYY-MM-DD HH");
        this.state = {
            modify: false,
            moment: init_moment,
            can_submit: false,
            validation_text: ""
        }
        this.modify = this.modify.bind(this);
        this.onClockChange = this.onClockChange.bind(this);
        this.submitBookingPeriod = this.submitBookingPeriod.bind(this);
        this.deleteBooking = this.deleteBooking.bind(this);
    }

    onClockChange(moment) {
        this.setState({ moment, can_submit: true });
    }

    submitBookingPeriod() {
        let begin_time = this.state.moment.clone();
        modify_booking(this.props.booking.id, this.props.booking.user, begin_time.format("YYYY-MM-DD HH"))
            .then((res) => {
                this.setState({ validation_text: "Your booking has been rescheduled to " + begin_time.format("MMMM Do YYYY, HH") + ":00" })
            });
    }

    modify() {
        this.setState({ modify: true });
    }

    deleteBooking() {
        delete_booking(this.props.booking.id)
            .then((res) => {
                this.props.update();
            });
    }

    render() {
        if (!this.state.modify) {
            return (<div>
                <p>From {moment(this.props.booking.beginning_time, "YYYY-MM-DD HH").format("MMMM Do YYYY, HH") + ":00 "}
                    to {moment(this.props.booking.end_time, "YYYY-MM-DD HH").format("MMMM Do YYYY, HH") + ":00"}</p>
                <button onClick={this.modify}>Reschedule</button>
                <button onClick={this.deleteBooking}>Cancel reservation</button>
            </div>
            )
        }
        return (<div>
            <DateTime onChange={this.onClockChange} value={this.state.moment} timeFormat="YYYY-MM-DD HH" />
            <button onClick={this.submitBookingPeriod}>Reschedule</button>
            <p>{this.state.validation_text}</p>
        </div>)
    }
}

export default Booking;