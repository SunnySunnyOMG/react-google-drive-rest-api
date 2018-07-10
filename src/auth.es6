import base64url from "base64url";
import axios from 'axios';
const crypto = require('crypto-browserify');
import { JWT } from './config.es6';

class Auth {
  constructor() {
    this.token = null;
    this.isInited = false;
  }

  init({ iss, private_key, server_client_id }) {
    if (iss && private_key && server_client_id) {
      this.id = server_client_id;
      // your server account email
      this.iss = iss;
      //private key obtained from the Google API Console: https://console.developers.google.com/
      this.priv_key = private_key;
      this.isInited = true;
    }

  }

  getServerClientId() { return this.id }

  isInited() { return this.isInited }
  /** ============================================================================
   *                              OAuth 2.0
   *  ============================================================================*/

  getJWT() {
    // generate time stamp for JWT claim
    let time_stamp = this._getTimeStampInSecond(new Date().getTime())
    this.timeStamp = time_stamp;
    //JWT part 2: claim
    let jwt_claim = base64url(JSON.stringify({
      "iss": this.iss,
      "scope": "https://www.googleapis.com/auth/drive", //TO DO: specify scope for each request
      "aud": "https://www.googleapis.com/oauth2/v4/token",
      "exp": time_stamp + 3600,
      "iat": time_stamp
    }));

    //JWT part 3: sign for the JWT
    // TODO: FIX BUG: write after end
    const Sign = crypto.createSign('RSA-SHA256');
    Sign.write(JWT.HEADER + "." + jwt_claim);
    Sign.end();

    // JWT part 3': signature
    let sig = base64url(Sign.sign(this.priv_key));

    /**
     * return full JWT that has been signed and is ready for transmission
     *  the JWT should look like: 
     *    {Base64url encoded header}.{Base64url encoded claim set}.{Base64url encoded signature}   
     */
    return JWT.HEADER + "." + jwt_claim + "." + sig;
  }

  // get service account access token by JWT
  getAccessToken(success_callback, fail_callback) {
    if (this.checkIfTokenValid()) return new Promise(resolve => resolve({ isSuccess: true, status: 'use existed token', data: { access_token: this.token } }));
    // refresh the JWT
    let jwt = this.getJWT();

    // refer to Google developer document: https://developers.google.com/identity/protocols/OAuth2ServiceAccount
    return axios.post(
      "https://www.googleapis.com/oauth2/v4/token",
      'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt,
      {
        validateStatus: () => true,
      }
    )
      .then(
        response => {
          // for security reason, access token should only save in the RAM
          if (response.status === 200) { //console.log('access_token: ', response.data.access_token); 
            this.token = response.data.access_token;
          }
          // return promise
          return { isSuccess: this._handleResponse(response, success_callback, fail_callback), status: response.status, data: response.data }
        })
      .catch((err) => console.error('Error when geting access token from Google \n ----------------- \n', err))
  }

  checkIfTokenValid() {
    // check if this access token is timeout; if still valid, return this token
    if (this.token && this._getTimeStampInSecond(new Date().getTime()) - this.timeStamp < 3540) {
      //console.log('===================Use existed valid token==================\n', this.token);
      return true;
    }
    else return false;

  }


  _getTimeStampInSecond(time_stamp_in_ms) {
    return Math.floor(time_stamp_in_ms / 1000);
  }
}

export default new Auth();