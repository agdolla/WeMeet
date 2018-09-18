"use strict";
import { logout } from "./";
import history from "./history";
const axios = require("axios");
const Promise = require("bluebird");
const debug = require("react-debug");
const swal = require("sweetalert");

exports.get = path => {
    return new Promise((resolve, reject) => {
        axios
            .get(path)
            .then(response => resolve(response))
            .catch(err => {
                debug(err);
                if (err.response.status === 401) {
                    logout();
                    history.push("/");
                } else {
                    swal(
                        "Oops!",
                        "An error occurred on the server side",
                        "error"
                    );
                }
                reject(err);
            });
    });
};

exports.put = (path, data = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .put(path, data)
            .then(response => resolve(response))
            .catch(err => {
                debug(err);
                if (err.response.status === 401) {
                    logout();
                    history.push("/");
                } else {
                    swal(
                        "Oops!",
                        "An error occurred on the server side",
                        "error"
                    );
                }
                reject(err);
            });
    });
};

exports.post = (path, data = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .post(path, data)
            .then(response => resolve(response))
            .catch(err => {
                debug(err);
                if (err.response.status === 401) {
                    logout();
                    history.push("/");
                } else {
                    swal(
                        "Oops!",
                        "An error occurred on the server side",
                        "error"
                    );
                }
                reject(err);
            });
    });
};

exports.delete = (path, data = {}) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(path, data)
            .then(response => resolve(response))
            .catch(err => {
                debug(err);
                if (err.response.status === 401) {
                    logout();
                    history.push("/");
                } else {
                    swal(
                        "Oops!",
                        "An error occurred on the server side",
                        "error"
                    );
                }
                reject(err);
            });
    });
};
