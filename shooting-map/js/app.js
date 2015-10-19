'use strict';

var overlayMaps = {
    "Killed": L.layerGroup([]),
    "Hit": L.layerGroup([]),
    "Unknown": L.layerGroup([]),
};

var stats = {
    'Male': {
        'Killed': 0,
        'Hit': 0,
        'Unknown': 0
    },
    'Female': {
        'Killed': 0,
        'Hit': 0,
        'Unknown': 0
    }
}

var parseShootings = function(data) {
    console.log('parsing');
    $.each(data, function(i, event ) {
        var marker = L.circleMarker([event.lat, event.lng]).bindPopup(event.summary);
        marker.addTo(overlayMaps[event.outcome]);
        if (event.victim.gender != 'Unknown') {
            console.log(event.victim.gender);
            stats[event.victim.gender][event.outcome] += 1;
        }
    });
    
}

$.getJSON('data/data.min.json').then(parseShootings);
console.log(stats);


var map = L.map('map-container').setView([40.913129, -102.491385], 5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'luisnaranjo733.no8peoka',
    accessToken: 'pk.eyJ1IjoibHVpc25hcmFuam83MzMiLCJhIjoiY2lmeDVra3Q1M3A0Z3U2a3N3d2JzNXFicCJ9.nLZGt1FxRVUxOUL-_1wrIg'
}).addTo(map);

L.control.layers(null, overlayMaps).addTo(map);

map.on('overlayadd', function(e) {
    // 
});