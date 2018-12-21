import React, { Component } from "react";
import { get_user_bookings } from "../../service/HttpRequests";
import BookingSet from "./BookingSet";
import kart_S_img from "../../assets/images/kartS.jpg";
import kart_CC_img from "../../assets/images/kartCC.jpg";
import kart_BF_img from "../../assets/images/kartBF.jpg";
let kart_images = { "kart_S": kart_S_img, "kart_CC": kart_CC_img, "kart_BF": kart_BF_img };

class Bookings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: {}
        }
        this.getBookings = this.getBookings.bind(this);
        this.update = this.update.bind(this);
    }

    getBookings() {
        get_user_bookings(this.props.user_id)
            .then((res) => {
                let dic = {};
                for (let booking of res.data) {
                    let book_set = booking.book_set;
                    if (dic[book_set] === undefined) {
                        dic[book_set] = [];
                    }
                    dic[book_set].push(booking);
                }
                this.setState({ bookings: dic });
            });
    }

    componentWillMount() {
        this.getBookings();
    }

    componentWillReceiveProps(new_props) {
        if (this.props !== new_props) {
            this.getBookings();
        }
    }

    getType(type_name) {
        let arr = type_name.split(" ");
        let new_type = "kart_";
        for (let word of arr) {
            new_type += word.slice(0, 1);
        }
        return new_type;
    }
    update() {
        this.getBookings();
    }

    render() {
        if (Object.keys(this.state.bookings).length === 0) {
            return (<p>You have no coming reservation</p>)
        }
        return (<ul>
            {Object.keys(this.state.bookings).map((book_set) =>
                <li>
                    <BookingSet bookings={this.state.bookings[book_set]}
                        kart_img={kart_images[this.getType(this.state.bookings[book_set][0].kart_type)]}
                        update={this.update} />
                </li>
            )}
        </ul>)
    }
}

export default Bookings;