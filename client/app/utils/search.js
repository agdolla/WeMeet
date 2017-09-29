//xmlhttprequest function
import {sendXHR} from './'

export function searchquery(querytext,cb){
    sendXHR('GET','/search/'+querytext, undefined, (xhr) => {
        cb(JSON.parse(xhr.responseText));
    });
}
