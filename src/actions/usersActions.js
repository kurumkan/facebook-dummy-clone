import browserHistory from 'browserHistory';

import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  SIGNIN_ERROR,
  SIGNUP_ERROR,
  AUTH_USER,
  UNAUTH_USER,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  SET_ACTIVE_USERS,
  CHANGE_USER_STATE
} from 'constants/actionTypes';

import api from 'api';

export const getUsers = (offset = 0, limit = 10) => (dispatch, getState) => {
  dispatch({ type: GET_USERS_REQUEST });

  return api.getUsers(offset, limit)
    .then((res) => {
      dispatch({
        type: GET_USERS_SUCCESS,
        payload: res.data.users
      });
    })
    .catch(e => {
      dispatch({
        type: GET_USERS_FAILURE,
        payload: 'Cannot load users'
      });
    });
};

export const getUser = username => (dispatch, getState) => {
  dispatch({ type: GET_USER_REQUEST });

  return api.getUser(username)
    .then((res) => {
      dispatch({
        type: GET_USER_SUCCESS,
        payload: res.data.user
      });
    })
    .catch(e => {
      if(e.response && e.response.status === 404) {
        browserHistory.push('/404');
      } else {
        dispatch({
          type: GET_USER_FAILURE,
          payload: 'Cannot load the user'
        });
      }
    });
};


export const updateUser = (username) => (dispatch, getState) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  const data = getState().form.updateUser.values;
  return api.updateUser(username, data)
    .then((res) => {
      localStorage.setItem( 'firstName', data.firstName );
      localStorage.setItem( 'lastName', data.lastName );
      localStorage.setItem( 'imageUrl', data.imageUrl );
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data
      });
      dispatch(getUsers());
    })
    .catch(e => {
      dispatch({
        type: UPDATE_USER_FAILURE,
        payload: 'Cannot load the user'
      });
    });
};

export const authUser = ({ token, userid, username, firstName, lastName, imageUrl }) => (dispatch) => {
  localStorage.setItem( 'token', token );
  localStorage.setItem( 'userid', userid );
  localStorage.setItem( 'username', username );
  localStorage.setItem( 'firstName', firstName );
  localStorage.setItem( 'lastName', lastName );
  localStorage.setItem( 'imageUrl', imageUrl );

  dispatch({ type: AUTH_USER, payload: { userid, firstName, lastName, imageUrl, username }, meta: { remote: true }});
  browserHistory.push('/');
};

export const signoutUser = () => (dispatch) => {
  localStorage.clear();
  browserHistory.push('/');

  dispatch({ type: UNAUTH_USER, meta: { remote: true } });
};

export const signupUser = () => (dispatch, getState) => {
  const { firstName, lastName, username, email, password, imageUrl } = getState().form.signup.values;
  return api.signupUser({ firstName, lastName, username, email, password, imageUrl })
    .then(response => dispatch(authUser(response.data)))
    .catch(e => {
      let message = 'Sorry something went wrong';
      if(e.request.status === 422) {
        message = 'This login or password are already in use';
      }

      dispatch({
        type: SIGNUP_ERROR,
        payload: message
      })
    });
};

export const signinUser = () => (dispatch, getState) => {
  const { login, password } = getState().form.signin.values;
  return api.signinUser({ login, password })
    .then((response) => dispatch(authUser(response.data)))
    .catch(e => {
      let message = 'Sorry something went wrong';
      if(e.request.status === 401) {
        message = 'The login or password is incorrect';
      }

      dispatch({
        type: SIGNIN_ERROR,
        payload: message
      })
    });
};

export const setActiveClients = (usersOnline) => dispatch => {
  dispatch({ type: SET_ACTIVE_USERS, payload: usersOnline });
};

export const notifyClientStatusChange = (username, isOnline) => dispatch => {
  dispatch({ type: CHANGE_USER_STATE, payload: { username, isOnline } });
};
