import {API_DOMAIN_UPLOAD} from './config.es6';
import call from './utils/call';
export default class GoogleDriveAPI {

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

  static getAbout(query_params, success_callback, fail_callback) {
    //let default_query_params = { fields: 'user' }
    let temp_params = Object.assign({}, { fields: 'user' }, query_params)
    return call('get', '/about', null, temp_params, null, success_callback, fail_callback);
  }

  static getStorage(query_params, success_callback, fail_callback) {
    //let default_query_params = { fields: 'user' }
    let temp_params = Object.assign({}, { fields: 'storageQuota' }, query_params)
    return call('get', '/about', null, temp_params, null, success_callback, fail_callback);
  }

  static listFile(query_params, success_callback, fail_callback) {
    return call('get', 'files', null, query_params, null, success_callback, fail_callback);
  }

  /**
   * Gets a file's metadata or content by ID
   */
  static getFile(fileId) {  
    return call('get', 'files/' + fileId +'?fields=size', null, null, null, null, null);
  }

  /**
   * Initiating a upload session for Resumable Upload
   * 
   * More details refer to: https://developers.google.com/drive/v3/web/resumable-upload
   */
  static _initResumableSession(name, type) {
    return call('post', 'files', { 'Content-Type': 'application/json; charset=UTF-8' },
      { 'uploadType': 'resumable' }, // query
      { 'name': name, 'mimeType': type }, //body
      null,
      (status, data) => { console.error('failed in init resumable session') },// fail callback 
      { domain: API_DOMAIN_UPLOAD }
    );
  }

  static _sendFileViaResumableSessionURI(uri, file) {
    return call('put', uri, null, null, file, null, null, { domain: null, noDefaultQueryParams: true, noDefaultDomain: true });
  }

  static _continueSendFileViaResumableSessionURI(uri, file) {
    return call('put', uri, null, null, file, null, null, { domain: null, noDefaultQueryParams: true, noDefaultDomain: true });
  }

  static importFileSimple(header, query_params, body, success_callback, fail_callback) {
    return call('post', '', header, query_params, body, success_callback, fail_callback, { domain: API_DOMAIN_UPLOAD });
  }

  // TODO
  static importFileMultipart() {

  }

  static importFileResumable(file, name, type) {
    return this._initResumableSession(name, type)
      .then((response) => {
        //console.log('initResumableSession response:', response)
        if (response.isSuccess) {
          return this._sendFileViaResumableSessionURI(response.header.location, file);
        }
      })
  }

  static exportFile(fileId, mimeType, success_callback, fail_callback) {
    //if(!mimeType) mimeType = 'text/html';
    return call('get', 'files/' + fileId + '/export', null, { mimeType: mimeType }, null, success_callback, fail_callback, {responseType:'arraybuffer'})
  }

  static deleteFile(fileId, success_callback, fail_callback) {
    return call('delete', 'files/' + fileId, null, null, null, success_callback, fail_callback);
  }

  static emptyTrash(success_callback, fail_callback) {
    return call('delete', 'files/trash', null, null, null, success_callback, fail_callback);
  }


  
}