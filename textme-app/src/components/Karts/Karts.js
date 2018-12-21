import React, { Component } from "react";
import DateTime from "react-datetime";
import axios from "axios";
import moment from "moment";
import { get_all_karts, get_booked_karts } from "../../service/HttpRequests";
import "./DateTime.css";
import ShowKarts from "./ShowKarts";

class Karts extends Component {
    constructor(props) {
        super(props);
        let initMoment = moment();
        initMoment.format("YYYY-MM-DD HH");
        this.state = {
            moment: initMoment,
            timeAmount: 1,
            canSubmit: false,
            available_karts: [],
            show_karts: false
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
        let begin_time = this.state.moment.clone();
        get_all_karts().then((res1) => {
            let all_karts = res1.data;
            let booked_karts = [];
            let promises = [];
            for (let i = 0; i < this.state.timeAmount; i++) {
                promises.push(get_booked_karts(begin_time.format("YYYY-MM-DD HH")));
                begin_time.add(1, "hours");
            }
            axios.all(promises).then((res2) => {
                let available_karts = [];
                for (let result of res2) {
                    if (result.data.length !== 0) {
                        booked_karts.push(result.data[0].kart);
                    }
                }
                for (let kart of all_karts) {
                    if (!booked_karts.includes(kart.id)) {
                        available_karts.push(kart);
                    }
                }
                this.setState({ available_karts: available_karts, show_karts: true });
            });
        })
    }

    render() {
        if (!this.state.show_karts) {
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
            );
        }
        return (<ShowKarts karts={this.state.available_karts} user_id={this.props.user_id}
            beginning_time={this.state.moment.clone()} duration={this.state.timeAmount}
            updateBalance={this.props.updateBalance}
            user_balance={this.props.user_balance} />)
    }
}

export default Karts;