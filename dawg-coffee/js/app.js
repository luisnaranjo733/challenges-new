'use strict';


var app = angular.module('CoffeeApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('Home', {
       url: '/', 
       templateUrl: 'partials/home.html',
       controller: 'HomeCtrl',
    });

    $stateProvider.state('Order', {
       url: '/orders', 
       templateUrl: 'partials/order.html',
       controller: 'OrderCtrl',
    });
    $urlRouterProvider.otherwise('/');

})

app.controller('HomeCtrl', ['$scope', function($scope) {
    $scope.headline_text = 'exquisite drinks made from fair-trade coffee, served in a relaxing and studious environment'
}]);

app.controller('OrderCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.hello = 'hello';
    $http.get('data/products.json').then(function(response) {
        console.log(response.data);
        $scope.orders = response.data;
    });
}]);