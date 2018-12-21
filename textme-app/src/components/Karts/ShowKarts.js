import React, { Component } from "react";
import "./ShowKarts.css";

import { book_kart } from "../../service/HttpRequests";
import axios from "axios";
import kart_S_img from "../../assets/images/kartS.jpg";
import kart_CC_img from "../../assets/images/kartCC.jpg";
import kart_BF_img from "../../assets/images/kartBF.jpg";
let kart_images = { "kart_S": kart_S_img, "kart_CC": kart_CC_img, "kart_BF": kart_BF_img };

class ShowKarts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            total_cost: 0,
            too_much: false
        }
        this.selectKart = this.selectKart.bind(this);
        this.makeBookings = this.makeBookings.bind(this);
        this.getBorderStyle = this.getBorderStyle.bind(this);
        this.totalCost = this.totalCost.bind(this);
        this.isTooMuch = this.isTooMuch.bind(this);
    }

    totalCost(dic) {
        let sum = 0;
        for (let kart_id of Object.keys(dic)) {
            sum += dic[kart_id].hourly_price;
        }
        sum = sum * this.props.duration;
        this.setState({ total_cost: sum });
        this.isTooMuch(sum);
    }

    isTooMuch(sum) {
        if (sum > this.props.user_balance) {
            this.setState({ too_much: true });
        }
        else {
            this.setState({ too_much: false });
        }
    }

    makeBookings() {
        for (let kart_id of Object.keys(this.state.selected)) {
            kart_id = parseInt(kart_id);
            let begin_time = this.props.beginning_time.clone();
            let promises = [];
            let book_set_id = "" + this.props.user_id + "-" + kart_id + "-" + begin_time.format("YYYY-MM-DD HH")
            for (let i = 0; i < this.props.duration; i++) {
                promises.push(book_kart(this.props.user_id, kart_id, book_set_id, begin_time.format("YYYY-MM-DD HH")));
                begin_time.add(1, "hours");
            }
            axios.all(promises).then((res2) => {
                this.props.updateBalance(0);
            });

        }
    }

    selectKart(kart) {
        let dic = JSON.parse(JSON.stringify(this.state.selected));
        let id = "" + kart.id;
        if (dic[id] !== undefined) {
            delete dic[id];
        } else {
            dic[id] = kart;
        }
        this.setState({ selected: dic });
        this.totalCost(dic);
    }

    getBorderStyle(kart) {
        let id = "" + kart.id;
        if (this.state.selected[id] !== undefined) {
            return "solid";
        }
        return "none";
    }

    render() {
        return (<div>
            <ul>
                {this.props.karts.map((kart) =>
                    <li><div className="kart_item" onClick={() => this.selectKart(kart)} style={{ borderStyle: this.getBorderStyle(kart) }}>
                        <ul>
                            <li>{kart.type_name}</li>
                            <li>{kart.hourly_price}</li>
                            <img src={kart_images["kart_" + kart.type_name]}
                                alt={"kart" + kart.type_name} className="kart_img"></img>
                        </ul>
                    </div></li>)}
            </ul>
            <p id="total">Total cost : {this.state.total_cost} $</p>
            <button disabled={this.state.too_much} onClick={this.makeBookings}>Book selected karts !</button>
            {this.state.too_much &&
                <p>You don't have enough cash for that !</p>
            }
        </div>
        )
    }
}

export default ShowKarts;