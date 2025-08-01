import { IUser } from "@/interfaces/auth/IUser";
import { IProfile } from "@/interfaces/auth/IProfile";

import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  RESEND_ACTIVATION_SUCCESS,
  RESEND_ACTIVATION_FAIL,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_CONFIRM_SUCCESS,
  FORGOT_PASSWORD_CONFIRM_FAIL,
  LOAD_PROFILE_FAIL,
  LOAD_PROFILE_SUCCESS,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/auth/types";

type Action = {
  type: string;
  payload?: any;
};

type State = {
  user: IUser | null;
  profile: IProfile | null;
  isAuthenticated: boolean;
};

const initialState: State = {
  user: null,
  profile: null,
  isAuthenticated: false,
};

export default function authReducer(state: State = initialState, action: Action = { type: "" }) {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
      return {
        ...state,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
      };
    case ACTIVATION_SUCCESS:
      return {
        ...state,
      };
    case ACTIVATION_FAIL:
      return {
        ...state,
      };
    case RESEND_ACTIVATION_SUCCESS:
      return {
        ...state,
      };
    case RESEND_ACTIVATION_FAIL:
      return {
        ...state,
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
      };
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
      };
    case FORGOT_PASSWORD_CONFIRM_SUCCESS:
      return {
        ...state,
      };
    case FORGOT_PASSWORD_CONFIRM_FAIL:
      return {
        ...state,
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        user: null,
      };
    case LOAD_PROFILE_SUCCESS:
      return {
        ...state,
        profile: payload,
      };
    case LOAD_PROFILE_FAIL:
      return {
        ...state,
        profile: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        profile: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}
