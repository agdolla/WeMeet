'use strict';

import {logout} from './';
import history from './history';
const axios = require('axios');
const Promise = require('bluebird');
const debug = require('react-debug');

class AxiosHelper {
    constructor() {

    }

    get(path) {
        return new Promise((resolve,reject)=>{
            axios.get(path)
            .then(response=>resolve(response))
            .catch(err=>{
                debug(err);
                logout();
                history.push('/');
                reject(err);
            })
        })
    }

    put(path, data = {}) {
        return new Promise((resolve, reject)=>{
            axios.put(path,data)
            .then(response=>resolve(response))
            .catch(err=>{
                debug(err);
                logout();
                history.push('/');
                reject(err);
            })
        })
    }

    post(path, data = {}) {
        return new Promise((resolve, reject)=>{
            axios.post(path,data)
            .then(response=>resolve(response))
            .catch(err=>{
                debug(err);
                logout();
                history.push('/');
                reject(err);
            })
        })
    }

    delete(path, data = {}) {
        return new Promise((resolve, reject)=>{
            axios.delete(path,data)
            .then(response=>resolve(response))
            .catch(err=>{
                debug(err);
                logout();
                history.push('/');
                reject(err);
            })
        })
    }
}

module.exports = new AxiosHelper();

