import axios from "axios";

const serverUrl = "http://localhost:8000/textmeApi/";
const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
};
let token = "";

export function setToken(received_token) {
    token = received_token;
}

export function send_register_form(email, password) {
    let url = serverUrl + "register";
    return (axios.post(url, { email: email, password: password }, config));
}

export function send_log_in_form(email, password) {
    let url = serverUrl + "login";
    return (axios.post(url, { email: email, password: password }, config));
}

export function get_balance(user_id) {
    let url = serverUrl + "get_balance/" + user_id + "/";
    return (axios.post(url, { "token": token }, config));
}

export function add_to_balance(user_id, amount) {
    let url = serverUrl + "increase_balance/" + user_id + "/";
    return (axios.post(url, { "amount": amount, "token": token }, config));
}

export function get_user_bookings(user_id) {
    let url = serverUrl + "bookings/" + user_id + "/";
    return (axios.post(url, { "token": token }, config));
}

export function get_all_karts() {
    let url = serverUrl + "kart_fleet";
    return (axios.get(url));
}

export function get_booked_karts(time) {
    let url = serverUrl + "booked_karts";
    return (axios.post(url, { "beginning_time": time }, config));
}

export function book_kart(user_id, kart_id, book_set_id, beginning_time) {
    let url = serverUrl + "add_booking";
    return (axios.post(url, { "user": user_id, "kart": kart_id, "book_set": book_set_id, "beginning_time": beginning_time + ":00", "token": token }, config));
}

export function booking_details(booking_id) {
    let url = serverUrl + "booking_detail/" + booking_id + "/";
    return (axios.post(url, { "token": token }, config));
}

export function modify_booking(booking_id, user_id, new_beginning_time) {
    let url = serverUrl + "modify_book/" + booking_id + "/";
    return (axios.post(url, { "user": user_id, "beginning_time": new_beginning_time + ":00", "token": token }, config));
}

export function delete_booking(booking_id) {
    let url = serverUrl + "delete_book/" + booking_id + "/";
    return (axios.post(url, { "token": token }, config));
}