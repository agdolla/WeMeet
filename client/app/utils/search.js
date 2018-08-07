let axiosHelper = require('./axiosHelper');
// const debug = require('react-debug');

export function searchquery(querytext){
    return axiosHelper.get('/search/'+querytext);
}
