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

    $stateProvider.state('OrderDetail', {
       url: '/orders/{id}', 
       templateUrl: 'partials/order_detail.html',
       controller: 'OrderDetailCtrl',
    });

    //$urlRouterProvider.otherwise('/');
})

app.controller('HomeCtrl', ['$scope', function($scope) {
    $scope.headline_text = 'exquisite drinks made from fair-trade coffee, served in a relaxing and studious environment'
}]);

app.controller('OrderCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.hello = 'hello';
    $http.get('data/products.json').then(function(response) {
        $scope.orders = response.data;
    });
    $scope.click = function(order) {
        //console.log(order);
    }
}]);

app.controller('OrderDetailCtrl', ['$scope', '$http', '$stateParams', '$filter', function($scope, $http, $stateParams, $filter) {
    $http.get('data/products.json').then(function(response) {
        var order = $filter('filter')(response.data, {
            id: $stateParams.id
        }, true)[0]
        $scope.order = order;
    });
}]);