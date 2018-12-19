import React, { Component } from "react";
import DateTime from "react-datetime";
import moment from "moment";
import { get_all_karts, get_booked_karts } from "../../service/HttpRequests";
import "./DateTime.css";

class Karts extends Component {
    constructor(props) {
        super(props);
        let initMoment = moment();
        initMoment.format("YYYY-MM-DD HH");
        this.state = {
            moment: initMoment,
            timeAmount: 1,
            canSubmit: false
        };
        this.onClockChange = this.onClockChange.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.submitBookingPeriod = this.submitBookingPeriod.bind(this);
    }

    onClockChange(moment) {
        this.setState({ moment, canSubmit: true });
    }

    changeAmount(e) {
        this.setState({ timeAmount: e.target.value });
    }

    submitBookingPeriod() {
        let begin_time = this.state.moment;
        get_all_karts().then((res1) => {
            let all_karts = res1.data;
            let booked_karts = [];
            for (let i = 0; i < this.state.timeAmount; i++) {
                get_booked_karts(begin_time.format("YYYY-MM-DD HH")).then((res2) => {
                    if (res2.data.length !== 0) {
                        console.log(res2.data);
                        booked_karts.push(res2.data[0].kart);
                    }
                });
                begin_time.add(1, "hours");
            }
            let available_karts = [];
            for (let kart of all_karts) {
                if (!booked_karts.includes(kart.id)) {
                    available_karts.push(kart);
                }
            }
            console.log(available_karts);
        })
    }

    render() {
        return (<div>
            <p>Choose a booking period : </p>
            <p>From : </p>
            <DateTime onChange={this.onClockChange} value={this.state.moment} timeFormat="YYYY-MM-DD HH" />
            <label>
                <span>During </span>
                <input type="number" value={this.state.timeAmount} onChange={this.changeAmount} />
                <span> hours</span>
            </label>
            <button onClick={this.submitBookingPeriod} disabled={!this.state.canSubmit}>See available Karts</button>
        </div>
        )
    }
}

export default Karts;