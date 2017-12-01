var map;
var markersArray = [];
var marker;
var makemarker;
var setmarker;

function addMarker(loc) {
    marker = new google.maps.Marker({
        position: loc,
        map: map
    });
    markersArray.push(marker);
}