'use strict';


var app = angular.module('CoffeeApp', ['ui.router']);

app.config(function($stateProvider) {
    $stateProvider.state('Home', {
       url: '/', 
       templateUrl: 'partials/home.html',
       controller: 'HomeCtrl',
    });

    $stateProvider.state('Order', {
       url: '/order', 
       templateUrl: 'partials/order.html',
       controller: 'OrderCtrl',
    });

})

app.controller('HomeCtrl', ['$scope', function($scope) {
    $scope.headline_text = 'exquisite drinks made from fair-trade coffee, served in a relaxing and studious environment'
}]);

app.controller('OrderCtrl', ['$scope', function($scope) {
    $scope.hello = 'hello';
}]);