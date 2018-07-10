'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JWT = exports.API_DOMAIN_UPLOAD = exports.API_DOMAIN = undefined;

var _base64url = require('base64url');

var _base64url2 = _interopRequireDefault(_base64url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//========HTTP REQUEST CONFIG==========
var API_DOMAIN = exports.API_DOMAIN = 'https://www.googleapis.com/drive/v3';
var API_DOMAIN_UPLOAD = exports.API_DOMAIN_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';

//======== JWT ===========
var JWT = exports.JWT = {
  HEADER: (0, _base64url2.default)(JSON.stringify({ "alg": "RS256", "typ": "JWT" })),
  AUD: "https://www.googleapis.com/oauth2/v4/token"
};
//# sourceMappingURL=config.js.map