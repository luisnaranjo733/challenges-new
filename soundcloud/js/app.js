'use strict';

var BASE_URL = 'https://api.soundcloud.com'; //website we fetch information from
var CLIENT_ID = '1ad29a5353733827b97f335387269fa1' //application ID for requests

// user id = 5678925

var urlGenerator = function(url_template, url_params) {
    var template = new URITemplate(BASE_URL + url_template);
    var url = template.expand(url_params);
    return url;
}

// http://api.soundcloud.com/users/5678925?client_id=1ad29a5353733827b97f335387269fa1
var getUserURL = function(user_id) {
    var url_template = '/users/{user_id}?client_id={client_id}';
    var url_params = {
        'user_id': user_id,
        'client_id': CLIENT_ID,
    }
    return urlGenerator(url_template, url_params);
}

// https://api.soundcloud.com/users/5678925/favorites?client_id=1ad29a5353733827b97f335387269fa1
var getUserFavoritesURL = function(user_id) {
    var url_template = '/users/{user_id}/favorites?client_id={client_id}';
    var url_params = {
        'user_id': user_id,
        'client_id': CLIENT_ID,
    }
    return urlGenerator(url_template, url_params);
}

// https://api.soundcloud.com/resolve?url=https://soundcloud.com/doubledubba&client_id=1ad29a5353733827b97f335387269fa1
var getUserIdURL = function(username) {
    var url_template = '/resolve?url={profile_url}&client_id={client_id}';
    var profile_url = 'https://soundcloud.com/' + username;
    var url_params = {
        'profile_url': profile_url,
        'client_id': CLIENT_ID,
    }
    return urlGenerator(url_template, url_params);
}

var myApp = angular.module('myApp', [])
    .controller('MyCtrl', ['$scope', '$http', function($scope, $http) { 
    $scope.query = 'doubledubba';
  
    //function called to fetch tracks based on the scope's query
    $scope.getTracks = function() {
        console.log('get tracks')
        var username = $scope.query;
        var request = getUserIdURL(username); //build the RESTful request UR
        $http.get(request) //Angular AJAX call
        .then(function (response) {
            var userId = response.data.id;
            request = getUserFavoritesURL(userId);
            $http.get(request).then(function(response) {
                console.log(response.data);
                // comment count, duration, playback_count
                $scope.tracks = response.data; //save results to available model
            })
            
        });
    };
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