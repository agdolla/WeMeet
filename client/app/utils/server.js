let axiosHelper = require('./axiosHelper');

export function searchquery(querytext) {
    return axiosHelper.get('/search/' + querytext);
}
