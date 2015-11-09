'use strict';

var setItem = function(key, value) {
    console.log('set item called');
    var json = JSON.stringify(value);
    localStorage.setItem(key, json);
}

var getItem = function(key) {
    var json = localStorage.getItem(key);
    return JSON.parse(json);
}

var removeItem = function(key) {
    localStorage.removeItem(key);
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
        var order_details = {
            id: product_id,
            quantity: $scope.quantity,
            grind_type: $scope.grind_type,
        }
        cartService.order(order_details);
        alert('Order submitted!');

    }
}]);

app.controller('OrderCartCtrl', ['$scope', 'cartService', function($scope, cartService) {
    console.log('hey')
    $scope.orders = getItem('orders');
    console.log($scope.orders);
    $scope.getTotal = function() {
        var sum = 0;
        for (var i = 0; i < $scope.orders.length; i++) {
            var order = $scope.orders[i];
            sum += order.price *  order.quantity;
        }
        return sum;
    }
    $scope.deleteOrder = function(order_to_remove) {
        for (var i = 0; i < $scope.orders.length; i++) {
            var order = $scope.orders[i];
            if (order == order_to_remove) {
                $scope.orders.splice(i, 1); // so it gets removed from view
                cartService.orders.splice(i, 1); // so it gets removed from localStorage
                setItem('orders', cartService.orders);
            }
        }
    }

    $scope.deleteOrders = function() {
        $scope.orders = null;
        removeItem('orders');
    }

}]);

app.factory('cartService', ['$http', '$filter', function($http, $filter) {
    var cart = {};
    cart.orders = getItem('orders');
    if (!cart.orders) {
        console.log('initializing orders');
        cart.orders = [];
        setItem('orders', cart.orders);
    }
    cart.order = function(order_details) {
        console.log('grind type');
        console.log(order_details.grind_type);

        $http.get('data/products.json').then(function(response) {
            var order = $filter('filter')(response.data, {
                id: order_details.id,
            }, true)[0]
            order.quantity = order_details.quantity;
            order.grind_type = order_details.grind_type;
            cart.orders.push(order);
            setItem('orders', cart.orders);
        });
    }

    return cart;
}]);