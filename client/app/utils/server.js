const axiosHelper = require('./axiosHelper.js');

export function searchquery(querytext) {
    return axiosHelper.get('/search/' + querytext);
}
