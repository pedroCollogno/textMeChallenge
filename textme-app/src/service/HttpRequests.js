import axios from "axios";

const serverUrl = "http://localhost:8000/textmeApi/";
const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
}

export function send_register_form(email, password) {
    let url = serverUrl + "register";
    return (axios.post(url, { email: email, password: password }, config));
}

export function send_log_in_form(email, password) {
    let url = serverUrl + "login";
    return (axios.post(url, { email: email, password: password }, config));
}

export function get_user_bookings(user_id) {
    let url = serverUrl + "bookings/" + user_id;
    return (axios.get(url));
}

export function get_all_karts() {
    let url = serverUrl + "kart_fleet";
    return (axios.get(url));
}

export function get_booked_karts(time) {
    let url = serverUrl + "booked_karts";
    return (axios.post(url, { "beginning_time": time }, config));
}
