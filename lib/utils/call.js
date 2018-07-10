
import auth from '../auth';
import axios from 'axios';
import { handleResponse } from './utils.es6';
import { API_DOMAIN } from '../config.es6';
/**
 * For easier way to call api 
 */
export default function call(method, resource, header, params, body, success_callback, fail_callback, options) {
  if (!auth.isInited) {
    console.warn('you should init your auth info');
    return;
  }
  return new Promise(resolve => {
    auth.getAccessToken().then(response => {
      if (response.isSuccess) return callAPI(method, resource, header, params, body, success_callback, fail_callback, options, response.data.access_token);else throw new Error('Cannot get an access token for Drive API');
    }).then(response => {
      if (response.isSuccess) resolve(response);else throw new Error('Calling Google Drive API failed: ' + resource);
    }).catch(err => {
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

function callAPI(method, resource, header, params, body, success_callback, fail_callback, options = { domain: null, noDefaultQueryParams: false, noDefaultDomain: false }, access_token) {

  let defaultHeader = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  };

  let tempHeader = Object.assign({}, defaultHeader, header);
  let tempParams = Object.assign({}, options.noDefaultQueryParams ? {} : { key: auth.getServerClientId() }, params);

  return axios.request({
    baseURL: options.domain || options.noDefaultDomain ? options.domain : API_DOMAIN,
    headers: tempHeader,
    method: method,
    params: tempParams,
    url: resource,
    data: body,
    validateStatus: function (status) {
      return true;
    },
    responseType: options.responseType,
    timeout: 60000
  }).then(response => {
    return {
      isSuccess: handleResponse(response, success_callback, fail_callback),
      status: response.status,
      data: response.data,
      response: response,
      header: response.headers
    };
  }).catch(err => console.error('Error occur when calling Google Drive API: ' + resource + '/n', err));
}
//# sourceMappingURL=call.js.map