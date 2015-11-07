'use strict';


var madLibApp = angular.module('CoffeeApp', [])
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.message = "hello world@";

}])