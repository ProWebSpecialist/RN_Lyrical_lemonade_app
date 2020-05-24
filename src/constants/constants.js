import { exp } from "react-native-reanimated";

export const HTTP_SHCEM = "http://";
export const SERVER_DOMAIN =  "93.188.162.83:4200";
export const API_SHEME = "/api"
export const BASE_URL = HTTP_SHCEM + SERVER_DOMAIN + API_SHEME;

export const SIGNUP_URL = BASE_URL + "/signup";
export const LOGIN_URL = BASE_URL + "/login";
export const DELETE_PROFILE_IMAGE = BASE_URL + "/deleteProfileImage";
export const UPDATE_PROFILE_URL = BASE_URL + "/updateProfile";
export const PROFILE_IMAGE_UPLOAD_URL = BASE_URL + "/updateProfileImage";
export const PUBLIC_FOLDER = HTTP_SHCEM + SERVER_DOMAIN + '/users_image/thumb/';
export const GET_ALL_EVENTS = BASE_URL + '/get_events';