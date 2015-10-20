'use strict';


var round = function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

var toPercentage = function(decimal_value) {
    //return decimal_value;
    return round(decimal_value * 100, 2);
}


var overlayMaps = {
    "Killed": L.layerGroup([]),
    "Hit": L.layerGroup([]),
    "Unknown": L.layerGroup([]),
};

var stats = {
    'Male': {
        'Killed': 0,
        'Hit': 0,
        'Unknown': 0,
        'Total': 0,
    },
    'Female': {
        'Killed': 0,
        'Hit': 0,
        'Unknown': 0,
        'Total': 0,
    },
    'Killed': 0,
    'Hit': 0,
    'Unknown': 0,
    'events': 0
}


var map = L.map('map-container').setView([40.913129, -102.491385], 5);

var incrementStats = function(event) {
    if (event.outcome && event.victim.gender != 'Unknown') {
        // tally gender totals
        stats[event.victim.gender]['Total'] += 1;
        // gender specific outcomes
        stats[event.victim.gender][event.outcome] += 1;
        // gender neutral outcomes
        stats[event.outcome] += 1;
        // sum of gender neutral outcomes
        stats.events += 1;
    }   
}

var clearStatsData = function() {
    stats = {
        'Male': {
            'Killed': 0,
            'Hit': 0,
            'Unknown': 0,
            'Total': 0,
        },
        'Female': {
            'Killed': 0,
            'Hit': 0,
            'Unknown': 0,
            'Total': 0,
        },
        'Killed': 0,
        'Hit': 0,
        'Unknown': 0,
        'events': 0
    }
}

var updateStats = function() {
    for (var key in overlayMaps) {
        if (overlayMaps.hasOwnProperty(key)) {
            var layerGroup = overlayMaps[key];
            var visible = map.hasLayer(layerGroup);
            if (visible) {
                //console.log('Updating visible: ' + key);
                var layers = layerGroup.getLayers();
                $.each(layers, function(i, marker) {
                    //update stats data
                    incrementStats(marker.event);
                })   
            }
        }
    }
    // update html
    var victim_total = stats.Male.Total + stats.Female.Total;
    var male_pct = toPercentage(stats.Male.Total / victim_total);
    $('#male-pct').html(male_pct);
    var female_pct = toPercentage(stats.Female.Total / victim_total);
    $('#female-pct').html(female_pct);

}



map.on('overlayadd', function(e) {
    clearStatsData();
    updateStats();
});

map.on('overlayremove', function(e) {
    clearStatsData();
    updateStats();
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
    marker.event = event;
    if (event.outcome && event.victim.gender != 'Unknown') {
        marker.addTo(overlayMaps[event.outcome]);
        incrementStats(event);
    }
}


// Main code

var parseData = function(data) {
    $.each(data, parseEvent);
    for (var key in overlayMaps) {
        if (overlayMaps.hasOwnProperty(key)) {
            var layerGroup = overlayMaps[key];
            map.addLayer(layerGroup);
            /*
            var layers = layerGroup.getLayers();
            $.each(layers, function(i, event) {

            })
            */
        }
    }
    updateStats();
}


/*
Parse each event
Create each marker
Add event JSON object to marker
Increment initial dataset for stats
Add each marker to layer
Add each layer to the map
*/
$.getJSON('data/data.min.json', parseData);