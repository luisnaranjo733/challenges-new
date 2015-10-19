'use strict';

var overlayMaps = {
    'Male': L.layerGroup([]),
    'Female': L.layerGroup([]),
};

var parseShootings = function(data) {
    console.log('parsing');
    $.each(data, function(i, event ) {
        var marker = L.marker([event.lat, event.lng]).bindPopup(event.summary);
         marker.addTo(overlayMaps[event.victim.gender]);

    });
}

$.getJSON('data/data.min.json').then(parseShootings);



var map = L.map('map-container').setView([40.913129, -102.491385], 5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'luisnaranjo733.no8peoka',
    accessToken: 'pk.eyJ1IjoibHVpc25hcmFuam83MzMiLCJhIjoiY2lmeDVra3Q1M3A0Z3U2a3N3d2JzNXFicCJ9.nLZGt1FxRVUxOUL-_1wrIg'
}).addTo(map);

L.control.layers(null, overlayMaps).addTo(map);