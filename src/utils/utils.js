export function handleResponse(response, success_callback, fail_callback) {
  if (response.status >= 200 && response.status < 300) {
    success_callback && success_callback(response.status, response.data);
    return true;
  }
  else {
    fail_callback && fail_callback(response.status, response.data);
    return false;
  }
}