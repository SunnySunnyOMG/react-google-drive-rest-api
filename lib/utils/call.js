'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = call;

var _auth = require('../auth');

var _auth2 = _interopRequireDefault(_auth);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _utils = require('./utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * For easier way to call api 
 */
function call(method, resource, header, params, body, success_callback, fail_callback, options) {
  if (!_auth2.default.isInited) {
    console.warn('you should init your auth info');
    return;
  }
  return new Promise(function (resolve) {
    _auth2.default.getAccessToken().then(function (response) {
      if (response.isSuccess) return callAPI(method, resource, header, params, body, success_callback, fail_callback, options, response.data.access_token);else throw new Error('Cannot get an access token for Drive API');
    }).then(function (response) {
      if (response.isSuccess) resolve(response);else throw new Error('Calling Google Drive API failed: ' + resource);
    }).catch(function (err) {
      console.error(err);
    });
  });
}

/** =================================================================
  *                    HTTP Resquest Function
  *  =================================================================*/

/**
 * Pure function to call Drive API (without Authorization step)
 * 
 * Params may need to notice here:
 * @param {Object} options ==>  vaild props:
 *        1. domain: customize domain if you dont want use a new domain
 *        2. noDefaultQueryParams: clear all default query params in your request
 *        3. noDefaultDomain: clear default domain, but not require a new domain(this prop is useful when you just want to set 'url' and ignore 'domain' in axios)
 *        4. responseType: define the response data type; default is application/json
 */

function callAPI(method, resource, header, params, body, success_callback, fail_callback) {
  var options = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : { domain: null, noDefaultQueryParams: false, noDefaultDomain: false };
  var access_token = arguments[8];


  var defaultHeader = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  };

  var tempHeader = Object.assign({}, defaultHeader, header);
  var tempParams = Object.assign({}, options.noDefaultQueryParams ? {} : { key: _auth2.default.getServerClientId() }, params);

  return _axios2.default.request({
    baseURL: options.domain || options.noDefaultDomain ? options.domain : _config.API_DOMAIN,
    headers: tempHeader,
    method: method,
    params: tempParams,
    url: resource,
    data: body,
    validateStatus: function validateStatus(status) {
      return true;
    },
    responseType: options.responseType,
    timeout: 60000
  }).then(function (response) {
    return {
      isSuccess: (0, _utils.handleResponse)(response, success_callback, fail_callback),
      status: response.status,
      data: response.data,
      response: response,
      header: response.headers
    };
  }).catch(function (err) {
    return console.error('Error occur when calling Google Drive API: ' + resource + '/n', err);
  });
}
//# sourceMappingURL=call.js.map