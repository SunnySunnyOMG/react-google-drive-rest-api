'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base64url = require('base64url');

var _base64url2 = _interopRequireDefault(_base64url);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _utils = require('./utils/utils');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var crypto = require('crypto-browserify');

var Auth = function () {
  function Auth() {
    _classCallCheck(this, Auth);

    this.token = null;
    this.isInited = false;
  }

  _createClass(Auth, [{
    key: 'init',
    value: function init(_ref) {
      var iss = _ref.iss,
          private_key = _ref.private_key,
          server_client_id = _ref.server_client_id;

      if (iss && private_key && server_client_id) {
        this.id = server_client_id;
        // your server account email
        this.iss = iss;
        //private key obtained from the Google API Console: https://console.developers.google.com/
        this.priv_key = private_key;
        this.isInited = true;
      }
    }
  }, {
    key: 'getServerClientId',
    value: function getServerClientId() {
      return this.id;
    }
  }, {
    key: 'isInited',
    value: function isInited() {
      return this.isInited;
    }
    /** ============================================================================
     *                              OAuth 2.0
     *  ============================================================================*/

  }, {
    key: 'getJWT',
    value: function getJWT() {
      // generate time stamp for JWT claim
      var time_stamp = this._getTimeStampInSecond(new Date().getTime());
      this.timeStamp = time_stamp;
      //JWT part 2: claim
      var jwt_claim = (0, _base64url2.default)(JSON.stringify({
        "iss": this.iss,
        "scope": "https://www.googleapis.com/auth/drive", //TO DO: specify scope for each request
        "aud": "https://www.googleapis.com/oauth2/v4/token",
        "exp": time_stamp + 3600,
        "iat": time_stamp
      }));

      //JWT part 3: sign for the JWT
      // TODO: FIX BUG: write after end
      var Sign = crypto.createSign('RSA-SHA256');
      Sign.write(_config.JWT.HEADER + "." + jwt_claim);
      Sign.end();

      // JWT part 3': signature
      var sig = (0, _base64url2.default)(Sign.sign(this.priv_key));

      /**
       * return full JWT that has been signed and is ready for transmission
       *  the JWT should look like: 
       *    {Base64url encoded header}.{Base64url encoded claim set}.{Base64url encoded signature}   
       */
      return _config.JWT.HEADER + "." + jwt_claim + "." + sig;
    }

    // get service account access token by JWT

  }, {
    key: 'getAccessToken',
    value: function getAccessToken(success_callback, fail_callback) {
      var _this = this;

      if (this.checkIfTokenValid()) return new Promise(function (resolve) {
        return resolve({ isSuccess: true, status: 'use existed token', data: { access_token: _this.token } });
      });
      // refresh the JWT
      var jwt = this.getJWT();

      // refer to Google developer document: https://developers.google.com/identity/protocols/OAuth2ServiceAccount
      return _axios2.default.post("https://www.googleapis.com/oauth2/v4/token", 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt, {
        validateStatus: function validateStatus() {
          return true;
        }
      }).then(function (response) {
        // for security reason, access token should only save in the RAM
        if (response.status === 200) {
          //console.log('access_token: ', response.data.access_token); 
          _this.token = response.data.access_token;
        }
        // return promise
        return { isSuccess: (0, _utils.handleResponse)(response, success_callback, fail_callback), status: response.status, data: response.data };
      }).catch(function (err) {
        return console.error('Error when geting access token from Google \n ----------------- \n', err);
      });
    }
  }, {
    key: 'checkIfTokenValid',
    value: function checkIfTokenValid() {
      // check if this access token is timeout; if still valid, return this token
      if (this.token && this._getTimeStampInSecond(new Date().getTime()) - this.timeStamp < 3540) {
        //console.log('===================Use existed valid token==================\n', this.token);
        return true;
      } else return false;
    }
  }, {
    key: '_getTimeStampInSecond',
    value: function _getTimeStampInSecond(time_stamp_in_ms) {
      return Math.floor(time_stamp_in_ms / 1000);
    }
  }]);

  return Auth;
}();

exports.default = new Auth();
//# sourceMappingURL=auth.js.map