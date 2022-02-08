import axios from 'axios'
import { setAlert } from './alert'

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from './types'
import setAuthToken from '../utils/setAuthToken'

//register user
export const register = ({ name, email, password }) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({ name, email, password })
        
        try {
            //register user route
            const res = await axios.post('/api/users', body, config)

            dispatch({
                type: REGISTER_SUCCESS,
                //user token
                payload: res.data
            })
        } catch (err) {
            const errors = err.response.data.errors

            if (errors) {
                errors.forEach(
                    //dispatch action to alert reducer
                    error => dispatch(
                        setAlert(error.msg, 'danger', 3000)
                    )
                )
            }

            dispatch({
                type: REGISTER_FAIL,
            })
        }
    }
}

//load user => get auth user
export const loadUser = () => {
    return async (dispatch) => {
        if (localStorage.token) {
            // set header 'x-auth-token'
            setAuthToken(localStorage.token)
        }

        try {
            const res = await axios.get('/api/auth')

            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: AUTH_ERROR
            })
        }
    }
}

//login user
export const login= ({ email, password }) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      //login user route
      const res = await axios.post("/api/auth", body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        //user token
        payload: res.data,
      });
        
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(
          //dispatch action to alert reducer
          (error) => dispatch(setAlert(error.msg, "danger", 3000))
        );
      }

      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
};