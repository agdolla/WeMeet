let axios = require('axios');
// const debug = require('react-debug');

export function searchquery(querytext){
    return axios.get('/search/'+querytext);
}
