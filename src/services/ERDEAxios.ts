import axios from "axios";
import urlJoin from "url-join";
import SecureStoreManager from "../components/AsyncStorageManager";

const DEBUG = process.env.EXPO_PUBLIC_API_DEBUG;
const locale = "es";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ERDEAxios = axios.create();

// Interceptor para solicitudes salientes
ERDEAxios.interceptors.request.use(
  async (config) => {
    // Obtener valores almacenados en SecureStore
    const userToken = await SecureStoreManager.getItem<string>("Token");
    const contentType = await SecureStoreManager.getItem<string>("contentType");
    const responseType =
      await SecureStoreManager.getItem<string>("responseType");

    if (userToken) {
      config.headers["Authorization"] = `Bearer ${userToken}`;
    }
    config.headers["Accept-Language"] = locale;

    if (contentType) {
      config.headers["Content-type"] = "multipart/form-data";
      if (DEBUG) console.warn("Content-type", "multipart/form-data");
    } else {
      if (DEBUG) console.warn("Content-type", "application/json");
      config.headers["Content-type"] = "application/json";
    }

    if (responseType) {
      config.headers["responseType"] = responseType;
      if (DEBUG) console.warn("ResponseType", responseType);
    }

    config.url = urlJoin(apiUrl, `${config.url}`);
    if (DEBUG) {
      console.warn("URL", config.method, config.url);
      config.data && console.warn("DATA", config.data);
    }
    return config;
  },
  (error) => {
    if (DEBUG) {
      console.warn("API CALL UNSUCCESSFUL");
      console.warn(JSON.stringify(error, null, 2));
    }
    return Promise.reject(error);
  },
);

// Interceptor para respuestas entrantes
ERDEAxios.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.warn("API CALL RESPONSE SUCCESSFUL");
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
      console.warn("API ERROR", errorMsg, apiUrl);
    }

    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          console.warn(
            "Bad Request - please check the request parameters for correct configuration",
            errorMsg,
          );
          break;
        case 401:
          console.warn("Session Expired", errorMsg);
          break;
        case 403:
          console.warn(
            "Forbidden - the passed auth params do not have permission to view this resource",
            errorMsg,
          );
          break;
        case 404:
          console.warn("Not Found", errorMsg);
          break;
        case 502:
          return Promise.reject(
            "Falla Temporal de comunicacion con el servidor, intente nuevamente mas tarde",
          );
          break;
        default:
          console.warn("Error", errorMsg);
          break;
      }
      return Promise.reject(error.response.data);
    }
  },
);

export default ERDEAxios;
