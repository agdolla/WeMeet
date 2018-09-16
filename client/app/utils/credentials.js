import io from 'socket.io-client';
const axiosHelper = require('./axiosHelper');
// var debug = require('react-debug');

export var socket = io();
/**
 * Stores authentication credentials.
 */
var user = null;
// var debug = require('react-debug');

/**
 * Get the user ID of the currently authenticated user.
 */
export function getUserId() {
  if (isUserLoggedIn()) {
    return user._id;
  }
  return null;
}


/**
 * Update the token and user document of the currently authenticated user.
 */
export function updateCredentials(newUser) {
  localStorage.setItem('user', JSON.stringify(newUser));
}

/**
 * Returns true if the user is logged in.
 * You will implement this during the workshop.
 */
export function isUserLoggedIn() {
  // Replace later.
  user = JSON.parse(localStorage.getItem('user'));
  return user !== null && user !== undefined;
}
/**
 * Logs the user out.
 * You will implement this during the workshop.
 */
export function logout() {
  if (user !== null) {
    socket.emit('logout', user._id);
    user = null;
    localStorage.removeItem('user');
  }
  axiosHelper.get('/logout');
}

export function getUserDataFromLocal() {
  if (isUserLoggedIn()) {
    return user;
  }
}
