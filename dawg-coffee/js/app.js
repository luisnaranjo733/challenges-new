'use strict';


var getOrderFromId = function(id) {

}

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

    $stateProvider.state('OrderCart', {
       url: '/orders/cart', 
       templateUrl: 'partials/order_cart.html',
       controller: 'OrderCartCtrl',
    });

    $stateProvider.state('OrderDetail', {
       url: '/orders/{id}', 
       templateUrl: 'partials/order_detail.html',
       controller: 'OrderDetailCtrl',
    });



    $urlRouterProvider.otherwise('/');
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

app.controller('OrderDetailCtrl', ['$scope', '$http', '$stateParams', '$filter', 'cartService', function($scope, $http, $stateParams, $filter, cartService) {
    $scope.grind_types = ['Whole Bean', 'Espresso', 'French Press', 'Cone Drip Filter', 'Flat Bottom Filter'];
    var product_id = $stateParams.id;
    $http.get('data/products.json').then(function(response) {
        var order = $filter('filter')(response.data, {
            id: product_id,
        }, true)[0]
        $scope.order = order;
    });
    $scope.submitForm = function(orderForm) {
        var order = {
            id: product_id,
            quantity: $scope.quantity,
            grind_type: $scope.grind_type,
        }
        cartService.order(order);

    }
}]);

app.controller('OrderCartCtrl', ['$scope', '$http','cartService', function($scope, $http, cartService) {

}]);

app.factory('cartService', function() {
    var cart = {};
    cart.orders = [];
    cart.order = function(order) {
        console.log('Making an order');
        cart.orders.push(order);
    }
    return cart;
});