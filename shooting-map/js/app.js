'use strict';

var overlayMaps = {
    "Killed": L.layerGroup([]),
    "Hit": L.layerGroup([]),
    "Unknown": L.layerGroup([]),
};

var killed_male_pct_obj = $('#killed-male');
var killed_female_pct_obj = $('#killed-female');
var hit_male_pct_obj = $('#hit-male');
var hit_female_pct_obj = $('#hit-female');

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

var updateStats = function(stats) {
    console.log('Updating stats');

    var killed_male_pct = toPercentage(stats.Male.Killed / stats.Killed);
    killed_male_pct_obj.html(killed_male_pct);

    var killed_female_pct = toPercentage(stats.Female.Killed / stats.Killed);
    killed_female_pct_obj.html(killed_female_pct);


    var hit_male_pct = toPercentage(stats.Male.Hit / stats.Hit);
    hit_male_pct_obj.html(hit_male_pct);

    var hit_female_pct = toPercentage(stats.Female.Hit / stats.Hit);
    hit_female_pct_obj.html(hit_female_pct);
}


var parseShootings = function(data) {
    $.each(data, function(i, event ) {
        var marker = L.circleMarker([event.lat, event.lng]).bindPopup(event.summary);
        marker.addTo(overlayMaps[event.outcome]);
        if (event.victim.gender != 'Unknown') {
            stats[event.victim.gender][event.outcome] += 1;
            stats[event.outcome] += 1  
        }
    });
    console.log('DONE');
    console.log(stats);
    
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

map.on('overlayadd', function(e) {
    updateStats(stats);
});

map.on('overlayremove', function(e) {
    updateStats(stats);
});

