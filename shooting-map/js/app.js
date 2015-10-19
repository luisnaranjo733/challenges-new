'use strict';

var overlayMaps = {
    'Male': L.layerGroup([]),
    'Female': L.layerGroup([]),
};



var doSomethingWithData = function(data) {
   // for each item in data
   // put in dict (city -> layergroup)
    $.each( data, function(i, event ) {
        var lat = event.lat;
        var lng = event.lng;
        var marker =  L.marker([lat, lng]).bindPopup('This is a popup');
        var victim = event.victim;
        var gender = victim.gender;
        marker.addTo(overlayMaps[gender]);
        
    });
}

//this will call the processData function and pass it the downloaded data to work with
$.getJSON('data/data.min.json').then(doSomethingWithData);

var map = L.map('map-container').setView([47.655575, -122.309439], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'luisnaranjo733.no8peoka',
    accessToken: 'pk.eyJ1IjoibHVpc25hcmFuam83MzMiLCJhIjoiY2lmeDVra3Q1M3A0Z3U2a3N3d2JzNXFicCJ9.nLZGt1FxRVUxOUL-_1wrIg'
}).addTo(map);

L.control.layers(null, overlayMaps).addTo(map);