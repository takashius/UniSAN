import axios from "axios";
import urlJoin from "url-join";
import "dotenv/config";

const DEBUG = process.env.API_DEBUG;
const locale = "es";
const apiUrl = process.env.API_URL;

const ERDEAxios = axios.create();

// interceptor for outgoing requests
ERDEAxios.interceptors.request.use(
  async (config) => {
    const userToken = localStorage.getItem("Token");
    const contentType = localStorage.getItem("contentType");
    const responseType = localStorage.getItem("responseType");
    if (userToken) {
      config.headers["Authorization"] = "Bearer " + userToken;
    }
    config.headers["Accept-Language"] = locale;
    if (contentType) {
      config.headers["Content-type"] = "multipart/form-data";
      if (DEBUG) console.log("Content-type", "multipart/form-data");
    } else {
      if (DEBUG) console.log("Content-type", "application/json");
      config.headers["Content-type"] = "application/json";
    }
    if (responseType) {
      config.headers["responseType"] = responseType;
      if (DEBUG) console.log("ResponseType", responseType);
    }

    config.url = urlJoin(apiUrl!, `${config.url}`);
    if (DEBUG) {
      console.log("URL", config.method, config.url);
      config.data && console.log("DATA", config.data);
    }
    return config;
  },
  (error) => {
    if (DEBUG) {
      console.log("API CALL UNSUCCESSFUL");
      console.log(JSON.stringify(error, null, 2));
    }
    return Promise.reject(error);
  }
);

// interceptor for incoming responses
ERDEAxios.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log("API CALL RESPONSE SUCCESSFUL");
    }

    if (response?.status === 200 || response?.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    const errorMsg = JSON.stringify(error.message);

    if (DEBUG) {
      console.log("API ERROR", errorMsg, apiUrl);
    }

    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          console.log(
            "Bad Request - please check the request parameters for correct configuration",
            errorMsg
          );
          break;
        case 401:
          console.log("Session Expired", errorMsg);
          break;
        case 403:
          console.log(
            "Forbidden - the passed auth params do not have permission to view this resource",
            errorMsg
          );
          break;
        case 404:
          console.log("Not Found", errorMsg);
          break;
        case 502:
          return Promise.reject(
            "Falla Temporal de comunicacion  con el servidor, intente nuevamente mas tarde"
          );
          break;
        default:
          console.log("Error", errorMsg);
          break;
      }
      return Promise.reject(error.response.data);
    }
  }
);

export default ERDEAxios;
