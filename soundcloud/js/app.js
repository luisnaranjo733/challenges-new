'use strict';

var BASE_URL = 'https://api.soundcloud.com'; //website we fetch information from
var CLIENT_ID = '1ad29a5353733827b97f335387269fa1' //application ID for requests

SC.initialize({
    client_id: CLIENT_ID
});


function showLoadingIcon() {
    var container = document.getElementById("container");
    var loading_icon = document.createElement('i');
    loading_icon.className = 'fa fa-5x fa-circle-o-notch fa-spin loading';
    loading_icon.id = 'loading_icon'
    container.appendChild(loading_icon);
}

function hideLoadingIcon() {    
    var parent = document.getElementById("container");
    var child = document.getElementById("loading_icon");
    parent.removeChild(child);
}



// user id = 5678925

var urlGenerator = function(url_template, url_params) {
    var template = new URITemplate(BASE_URL + url_template);
    var url = template.expand(url_params);
    return url;
}

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

// https://api.soundcloud.com/users/5678925/favorites?client_id=1ad29a5353733827b97f335387269fa1
var getUserFavoritesByUserURL = function(user_id) {
    var url_template = '/users/{user_id}/favorites?client_id={client_id}';
    var url_params = {
        'user_id': user_id,
        'client_id': CLIENT_ID,
    }
    return urlGenerator(url_template, url_params);
}

var getTrackByTrackID = function(track_id) {

}


var myApp = angular.module('myApp', [])
    .controller('MyCtrl', ['$scope', '$http', function($scope, $http) { 
  
    $scope.embed = function() {
        console.log('embedding');

        var track_url = 'http://soundcloud.com/forss/flickermood';
        SC.oEmbed(track_url, { auto_play: true }).then(function(oEmbed) {
          console.log(oEmbed.html);
          var e = document.getElementById("player");
          e.innerHTML = oEmbed.html;
        });
    }

    //function called to fetch tracks based on the scope's query
    $scope.getTracks = function() {
        showLoadingIcon();
        var username = $scope.query;
        var request = getUserURLByUsername(username); //build the RESTful request UR
        $http.get(request) //Angular AJAX call
        .then(function (response) {
            var userId = response.data.id;
            request = getUserFavoritesByUserURL(userId);
            $http.get(request).then(function(response) {
                // comment count, duration, playback_count
                if (response.data.length > 0) {
                    console.log(response.data)
                    $scope.tracks = response.data; //save results to available model
                } else {
                    console.log('No tracks found!');
                }
                hideLoadingIcon();
                
            })
            
        });
    };

    $scope.clickTrack = function($event) {
        var id = null;
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
          player.style.display = 'block';
          player.innerHTML = oEmbed.html;
        });
    }

}])



/* Assignment requirements 

* Use the RESTful API to get data
- Use at least one of the API endpoints
* Use Angular directives to display data
- Data retrieved from API should be directly linked to the view
- No submit button on form
* Include an HTML Form with Angular and Validation
-Application should impose and validate some requirements on the form.
or example, maybe there is a minimum number of characters needed to
search for a song, or the user must fill out all options before searching.
Be sure and give the user feedback regarding their entry. 

* Do something creative

*/