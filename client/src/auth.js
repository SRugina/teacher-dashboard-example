// adapted from https://github.com/vuejs/vue-router/blob/dev/examples/auth-flow/auth.js
import axios from 'axios';
import querystring from 'querystring';
import { isset } from './utils/isset';
import cookies from 'js-cookie';

export default {
  login(email, password, callback) {
    callback = arguments[arguments.length - 1]
    axios.post('/api/v1/teachers/auth', querystring.stringify({
      email: email,
      password: password
    })).then((response) => {
      let data = response.data;
      if (data["success"]) {
        cookies.set('tr-token', data["data"]["token"], { expires: 1 / 24, secure: true })
        if (callback) callback(true)
        this.onChange(true)
        return
      } else {
        if (callback) callback(false)
        this.onChange(false)
        return
      }
    });
  },

  getToken() {
    let token = cookies.get('tr-token');
    if (isset(() => token)) {
      return token;
    } else {
      return false;
    }
  },

  logout(callback) {
    cookies.remove('tr-token');
    if (callback) callback()
    this.onChange(false)
  },

  loggedIn() {
    if (!this.getToken()) {
      //console.log("logged in false");
      this.onChange(false);
      return false;
    } else {
      return axios.post('/api/v1/teachers/verify', querystring.stringify({
        token: this.getToken()
      })).then((response) => {
        let data = response.data;
        //console.log(data['success']);
        this.onChange(data['success']);
        return data['success'];
      });
      //this.onChange(true);
      //return true;
    }
  },

  onChange() { }
}
