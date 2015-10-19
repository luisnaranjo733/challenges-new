/* add your script methods and logic here */

'use strict';

var map = L.map('map-container').setView([47.655575, -122.309439], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'luisnaranjo733.no8peoka',
    accessToken: 'pk.eyJ1IjoibHVpc25hcmFuam83MzMiLCJhIjoiY2lmeDVra3Q1M3A0Z3U2a3N3d2JzNXFicCJ9.nLZGt1FxRVUxOUL-_1wrIg'
}).addTo(map);

var littleton = L.marker([47.654462, -122.308195]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([47.654520, -122.303539]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([47.654665, -122.313795]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([47.656920, -122.303839]).bindPopup('This is Golden, CO.');

var cities = L.layerGroup([littleton, denver, aurora, golden]);

var overlayMaps = {
    "Cities": cities
};

L.control.layers(null, overlayMaps).addTo(map);