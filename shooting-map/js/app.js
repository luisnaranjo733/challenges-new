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
    },
    'Killed': 0,
    'Hit': 0
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

var toPercentage = function(decimal_value) {
    return round(decimal_value * 100, 2);
}

var killed_pct_obj = $('#killed-pct');
var hit_pct_obj = $('#hit-pct');
var unknown_pct_obj = $('#unknown-pct');

var updateStats = function(stats) {
    console.log('Updating stats');
}

var map = L.map('map-container').setView([40.913129, -102.491385], 5);

map.on('overlayadd', function(e) {
    console.log(e.name + 'layer added');
});

map.on('overlayremove', function(e) {
    console.log(e.name + 'layer removed');
});


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'luisnaranjo733.no8peoka',
    accessToken: 'pk.eyJ1IjoibHVpc25hcmFuam83MzMiLCJhIjoiY2lmeDVra3Q1M3A0Z3U2a3N3d2JzNXFicCJ9.nLZGt1FxRVUxOUL-_1wrIg'
}).addTo(map);




L.control.layers(null, overlayMaps).addTo(map);


var parseEvent = function(i, event ) {
    var marker = L.circleMarker([event.lat, event.lng]).bindPopup(event.summary);
    marker.addTo(map);
    if (event.outcome && event.victim.gender != 'Unknown') {
        marker.addTo(overlayMaps[event.outcome]);
        // gender specific stats
        stats[event.victim.gender][event.outcome] += 1;
        // all stats
        stats[event.outcome] += 1;
    }
}


var parseData = function(data) {
    $.each(data, parseEvent);
    console.log('Finished parsing data');
    for (var key in overlayMaps) {
        if (overlayMaps.hasOwnProperty(key)) {
            console.log(key);
            var layerGroup = overlayMaps[key];
            var layers = layerGroup.getLayers();
            $.each(layers, function(i, layer) {
                if (map.hasLayer(layer)) {
                    console.log(layer);
                }
            })
        }
    }
    
}

//$.getJSON('data/data.min.json').then(parseShootings);
$.getJSON('data/data.min.json', parseData);
