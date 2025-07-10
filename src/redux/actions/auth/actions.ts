import { Dispatch, UnknownAction } from "redux";
import { ToastError, ToastSuccess } from "@/components/toast/alerts";

import {
  IActivationProps,
  ILoginProps,
  IRegisterProps,
  IResendActivationProps,
  IForgotPasswordProps,
  IForgotPasswordConfirmProps,
} from "./interfaces";

import {
  ACTIVATION_FAIL,
  ACTIVATION_SUCCESS,
  SIGNUP_FAIL,
  SIGNUP_SUCCESS,
  RESEND_ACTIVATION_SUCCESS,
  RESEND_ACTIVATION_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_CONFIRM_SUCCESS,
  FORGOT_PASSWORD_CONFIRM_FAIL,
  LOAD_PROFILE_FAIL,
  LOAD_PROFILE_SUCCESS,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT,
} from "./types";

import { ThunkDispatch } from "redux-thunk";
import { RootState } from "@/redux/reducers";
import { syncCart } from "../cart/actions";

export const register = (props: IRegisterProps) => async (dispatch: Dispatch) => {
  try {
    const body = JSON.stringify({
      email: props.email,
      username: props.username,
      first_name: props.first_name,
      last_name: props.last_name,
      password: props.password,
      re_password: props.re_password,
    });

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();

    if (res.status === 201) {
      dispatch({
        type: SIGNUP_SUCCESS,
      });
      ToastSuccess("We have sent you an email, please click the link to verify your account.");
    } else {
      dispatch({
        type: SIGNUP_FAIL,
      });
      if (data.email && data.email.length > 0) {
        ToastError(data.email[0]);
      } else if (data.username && data.username.length > 0) {
        ToastError(data.username[0]);
      } else {
        ToastError("An unknown error occurred.");
      }
    }
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
    });
  }
};

export const activate = (props: IActivationProps) => async (dispatch: Dispatch) => {
  try {
    const body = JSON.stringify({
      uid: props.uid,
      token: props.token,
    });

    const res = await fetch("/api/auth/activate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.status === 204) {
      dispatch({
        type: ACTIVATION_SUCCESS,
      });
      ToastSuccess("Your account has been activated, you may now login.");
    } else {
      dispatch({
        type: ACTIVATION_FAIL,
      });
      ToastError("There was an error activating your account.");
    }
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
  }
};

export const resendActivation = (props: IResendActivationProps) => async (dispatch: Dispatch) => {
  try {
    const body = JSON.stringify({
      email: props.email,
    });

    const res = await fetch("/api/auth/resend_activation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.status === 204) {
      ToastSuccess("We have sent you an email to activate your account.");
      dispatch({
        type: RESEND_ACTIVATION_SUCCESS,
      });
    } else {
      dispatch({
        type: RESEND_ACTIVATION_FAIL,
      });
      ToastError("There was an error resending the activation email.");
    }
  } catch (err) {
    dispatch({
      type: RESEND_ACTIVATION_FAIL,
    });
    ToastError("Unexpected error");
  }
};

export const forgotPassword = (props: IForgotPasswordProps) => async (dispatch: Dispatch) => {
  try {
    const body = JSON.stringify({
      email: props.email,
    });

    const res = await fetch("/api/auth/forgot_password", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.status === 204) {
      ToastSuccess("We have sent you an email to recover your account.");
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
      });
    } else {
      dispatch({
        type: FORGOT_PASSWORD_FAIL,
      });
      ToastError("There was an error sending the recovery email.");
    }
  } catch (err) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
    });
    ToastError("Unexpected error");
  }
};

export const forgotPasswordConfirm =
  (props: IForgotPasswordConfirmProps) => async (dispatch: Dispatch) => {
    try {
      const body = JSON.stringify({
        new_password: props.new_password,
        re_new_password: props.re_new_password,
        uid: props.uid,
        token: props.token,
      });

      const res = await fetch("/api/auth/forgot_password_confirm", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
      });

      if (res.status === 204) {
        ToastSuccess("Your password has been reset, you may now login.");
        dispatch({
          type: FORGOT_PASSWORD_CONFIRM_SUCCESS,
        });
      } else {
        ToastError("There was an error resending the activation email.");
        dispatch({
          type: FORGOT_PASSWORD_CONFIRM_FAIL,
        });
      }
    } catch (err) {
      ToastError("Unexpected error");
      dispatch({
        type: FORGOT_PASSWORD_CONFIRM_FAIL,
      });
    }
  };

export const loadUser = () => async (dispatch: Dispatch) => {
  try {
    const res = await fetch("/api/auth/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (res.status === 200) {
      dispatch({
        type: LOAD_USER_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: LOAD_USER_FAIL,
      });
      ToastError("Error loading user information.");
    }
  } catch (err) {
    dispatch({
      type: LOAD_USER_FAIL,
    });
  }
};

export const loadProfile = () => async (dispatch: Dispatch) => {
  try {
    const res = await fetch("/api/auth/profile");

    const data = await res.json();

    if (res.status === 200) {
      dispatch({
        type: LOAD_PROFILE_SUCCESS,
        payload: data.results,
      });
    } else {
      dispatch({
        type: LOAD_PROFILE_FAIL,
      });
      ToastError("Error loading user profile.");
    }
  } catch (err) {
    dispatch({
      type: LOAD_PROFILE_FAIL,
    });
  }
};

export const login =
  (props: ILoginProps) => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const body = JSON.stringify({
        email: props.email,
        password: props.password,
      });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
      });

      if (res.status === 200) {
        dispatch({
          type: LOGIN_SUCCESS,
        });
        await dispatch(loadUser());
        await dispatch(loadProfile());
        await dispatch(syncCart());

        ToastSuccess("Login successfull!");
      } else {
        dispatch({
          type: LOGIN_FAIL,
        });
        ToastError("Login failed please verify your email and password");
      }
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };

export const setLoginSuccess = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOGIN_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  try {
    const res = await fetch("/api/auth/logout");
    if (res.status === 200) {
      dispatch({
        type: LOGOUT,
      });
    }
  } catch (err) {
    ToastError("Could not log out");
  }
};
