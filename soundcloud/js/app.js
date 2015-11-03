'use strict';

var BASE_URL = 'https://api.soundcloud.com'; //website we fetch information from
var CLIENT_ID = '1ad29a5353733827b97f335387269fa1' //application ID for requests

// Initialize soundcloud SDK
SC.initialize({
    client_id: CLIENT_ID
});


// Show the loading icon
function showLoadingIcon() {
    var container = document.getElementById("container");
    var loading_icon = document.createElement('i');
    loading_icon.className = 'fa fa-5x fa-circle-o-notch fa-spin loading';
    loading_icon.id = 'loading_icon'
    container.appendChild(loading_icon);
}

// Hide the loading icon
function hideLoadingIcon() {    
    var parent = document.getElementById("container");
    var child = document.getElementById("loading_icon");
    parent.removeChild(child);
}


// Pass in a url template, and the variables needed to 
// expand that template, and get the rendered url
var urlGenerator = function(url_template, url_params) {
    var template = new URITemplate(BASE_URL + url_template);
    var url = template.expand(url_params);
    return url;
}

// Pass in username, receive URL needed to call GET request
// in order to get that user's URL
// https://api.soundcloud.com/resolve?url=https://soundcloud.com/doubledubba&client_id=1ad29a5353733827b97f335387269fa1
var getUserURLByUsername = function(username) {
    var url_template = '/resolve?url={profile_url}&client_id={client_id}';
    var profile_url = 'https://soundcloud.com/' + username;
    var url_params = {
        'profile_url': profile_url,
        'client_id': CLIENT_ID,
    }
    return urlGenerator(url_template, url_params);
}

// Pass in user's id and receive URL needed to call GET request
// for user's favorite songs
// https://api.soundcloud.com/users/5678925/favorites?client_id=1ad29a5353733827b97f335387269fa1
var getUserFavoritesByUserURL = function(user_id) {
    var url_template = '/users/{user_id}/favorites?client_id={client_id}';
    var url_params = {
        'user_id': user_id,
        'client_id': CLIENT_ID,
    }
    return urlGenerator(url_template, url_params);
}


/*
The hipster scale is graded based on the total # of favorites per track
<5,000 favorites is 5 stars
<50,000 favorites is 4 stars
<100,000+ favorites is 3 stars
<500,000+ favorites is 2 stars
<1,000,000+ favorites is 1 star
*/
var rankHipsterScale = function(data) {
    console.log('Ranking you on the hipster scale!');
    var total_favorites = 0;
    var n_tracks = data.length;
    for (var i = 0; i < data.length; i++) {
        var track = data[i];
        var n_favorites = track.favoritings_count;
        if (n_favorites) {
            total_favorites += n_favorites;
        } else {
            n_tracks = n_tracks - 1; // for the case when a track has no favorites (we just ignore it from our rankings)
        }
    }
    var favorites_per_track = total_favorites / n_tracks;
    if (favorites_per_track < 5000) {
        console.log('5 stars');
    } else if (favorites_per_track < 50000) {
        console.log('4 stars');
    } else if (favorites_per_track < 100000) {
        console.log('3 stars');
    } else if (favorites_per_track < 500000) {
        console.log('2 stars');
    } else {
        console.log('1 star');
    }
}


var myApp = angular.module('myApp', [])
    .controller('MyCtrl', ['$scope', '$http', function($scope, $http) { 
    $scope.query = 'doubledubba';

    //function called to fetch tracks based on the scope's query
    $scope.getTracks = function() {
        showLoadingIcon();
        var username = $scope.query;
        var request = getUserURLByUsername(username); //build the RESTful request URL
        $http.get(request) //Angular AJAX call
        .then(function (response) {
            var userId = response.data.id;
            request = getUserFavoritesByUserURL(userId);
            $http.get(request).then(function(response) {
                if (response.data.length > 0) {
                    $scope.tracks = response.data; //save results to available model
                    rankHipsterScale(response.data);
                } else {
                    console.log('No tracks found!');
                }
                hideLoadingIcon(); // we want to remove the loading icon either way
            })
            
        });
    };

    $scope.clickTrack = function($event) {
        var id = null;
        // multiple conditionals needed because we don't know which
        // div the user  is going to click in
        // (the parent div's id has the track permalink url)
        if ($event.target.id) {
            id = $event.target.id;
        } else if ($event.target.parentElement.id) {
            id = $event.target.parentElement.id
        }  else {
            id = $event.target.parentElement.parentElement.id
        }
        

        SC.oEmbed(id, {
            auto_play: true,
            maxheight: 100
        }).then(function(oEmbed) {
          var player = document.getElementById("player");
          player.style.display = 'block'; // hidden by default
          player.innerHTML = oEmbed.html;
        });
    }

}])



/* TODO

* Publish to server
* ReadMe
* Complete hipster ranking

*/