'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _call = require('./utils/call');

var _call2 = _interopRequireDefault(_call);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoogleDriveAPI = function () {
  function GoogleDriveAPI() {
    _classCallCheck(this, GoogleDriveAPI);
  }

  _createClass(GoogleDriveAPI, null, [{
    key: 'getAbout',


    /** =================================================================
     *                    Google Drive Rest API
     *  =================================================================*/

    /**
     * Google API calling functions, basic paramters are:
     *  1. path params (if needed): String
     *  2. query params (if needed): Object
     *  3. body (if needed): Object
     *  4. customized params (if needed): Any
     *  5. success/fail callback: Function
     * 
     * More details refer to: https://developers.google.com/drive/v3/reference/
     */

    value: function getAbout(query_params, success_callback, fail_callback) {
      //let default_query_params = { fields: 'user' }
      var temp_params = Object.assign({}, { fields: 'user' }, query_params);
      return (0, _call2.default)('get', '/about', null, temp_params, null, success_callback, fail_callback);
    }
  }, {
    key: 'getStorage',
    value: function getStorage(query_params, success_callback, fail_callback) {
      //let default_query_params = { fields: 'user' }
      var temp_params = Object.assign({}, { fields: 'storageQuota' }, query_params);
      return (0, _call2.default)('get', '/about', null, temp_params, null, success_callback, fail_callback);
    }
  }, {
    key: 'listFile',
    value: function listFile(query_params, success_callback, fail_callback) {
      return (0, _call2.default)('get', 'files', null, query_params, null, success_callback, fail_callback);
    }

    /**
     * Gets a file's metadata or content by ID
     */

  }, {
    key: 'getFile',
    value: function getFile(fileId) {
      return (0, _call2.default)('get', 'files/' + fileId + '?fields=size', null, null, null, null, null);
    }

    /**
     * Initiating a upload session for Resumable Upload
     * 
     * More details refer to: https://developers.google.com/drive/v3/web/resumable-upload
     */

  }, {
    key: '_initResumableSession',
    value: function _initResumableSession(name, type) {
      return (0, _call2.default)('post', 'files', { 'Content-Type': 'application/json; charset=UTF-8' }, { 'uploadType': 'resumable' }, // query
      { 'name': name, 'mimeType': type }, //body
      null, function (status, data) {
        console.error('failed in init resumable session');
      }, // fail callback 
      { domain: _config.API_DOMAIN_UPLOAD });
    }
  }, {
    key: '_sendFileViaResumableSessionURI',
    value: function _sendFileViaResumableSessionURI(uri, file) {
      return (0, _call2.default)('put', uri, null, null, file, null, null, { domain: null, noDefaultQueryParams: true, noDefaultDomain: true });
    }
  }, {
    key: '_continueSendFileViaResumableSessionURI',
    value: function _continueSendFileViaResumableSessionURI(uri, file) {
      return (0, _call2.default)('put', uri, null, null, file, null, null, { domain: null, noDefaultQueryParams: true, noDefaultDomain: true });
    }
  }, {
    key: 'importFileSimple',
    value: function importFileSimple(header, query_params, body, success_callback, fail_callback) {
      return (0, _call2.default)('post', '', header, query_params, body, success_callback, fail_callback, { domain: _config.API_DOMAIN_UPLOAD });
    }

    // TODO

  }, {
    key: 'importFileMultipart',
    value: function importFileMultipart() {}
  }, {
    key: 'importFileResumable',
    value: function importFileResumable(file, name, type) {
      var _this = this;

      return this._initResumableSession(name, type).then(function (response) {
        //console.log('initResumableSession response:', response)
        if (response.isSuccess) {
          return _this._sendFileViaResumableSessionURI(response.header.location, file);
        }
      });
    }
  }, {
    key: 'exportFile',
    value: function exportFile(fileId, mimeType, success_callback, fail_callback) {
      //if(!mimeType) mimeType = 'text/html';
      return (0, _call2.default)('get', 'files/' + fileId + '/export', null, { mimeType: mimeType }, null, success_callback, fail_callback, { responseType: 'arraybuffer' });
    }
  }, {
    key: 'deleteFile',
    value: function deleteFile(fileId, success_callback, fail_callback) {
      return (0, _call2.default)('delete', 'files/' + fileId, null, null, null, success_callback, fail_callback);
    }
  }, {
    key: 'emptyTrash',
    value: function emptyTrash(success_callback, fail_callback) {
      return (0, _call2.default)('delete', 'files/trash', null, null, null, success_callback, fail_callback);
    }
  }]);

  return GoogleDriveAPI;
}();

exports.default = GoogleDriveAPI;
//# sourceMappingURL=api.js.map