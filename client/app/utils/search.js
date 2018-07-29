let axios = require('axios');
const debug = require('react-debug');

export function searchquery(querytext,cb){
    axios.get('/search/'+querytext)
    .then(response=>{
        debug(response.data);
        cb(response.data)
    });
}
