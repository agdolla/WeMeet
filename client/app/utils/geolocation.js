import {sendXHR} from './'



export function getlocation(cb){
    if (/Edge\/\d./i.test(navigator.userAgent)){
        return cb("error");
    }
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET',
            'https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+","+position.coords.longitude+'&sensor=true');
            xhr.onload = function() {
                cb(JSON.parse(xhr.responseText));
            }
            xhr.send();
        });
    }
    else{
        cb("Google is banned");
    }
}

export function setlocation(userId,location){
    sendXHR('PUT','/settings/location/user/'+userId,location,()=>{
    });
}
