import base64url from "base64url";
//========HTTP REQUEST CONFIG==========
export const API_DOMAIN = 'https://www.googleapis.com/drive/v3';
export const API_DOMAIN_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';

//======== JWT ===========
export const JWT ={
  HEADER: base64url((JSON.stringify({ "alg": "RS256", "typ": "JWT" }))),
  AUD: "https://www.googleapis.com/oauth2/v4/token"
  };
