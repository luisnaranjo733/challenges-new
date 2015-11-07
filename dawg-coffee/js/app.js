'use strict';


var app = angular.module('CoffeeApp', ['ui.router']);

app.config(function($stateProvider) {
    //first param is a name (label) for the state
    //second param is an object of options
    $stateProvider.state('home', { // '/' (root) is also for home
       url: '/', //the route for this state
       templateUrl: 'partials/home.html', //path to partial to load
    })
})

app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.message = "hello world@";

}]);