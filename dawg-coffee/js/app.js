'use strict';

var setItem = function(key, value) {
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

var app = angular.module('CoffeeApp', ['ui.router', 'ui.bootstrap']);

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
}]);

app.controller('OrderDetailCtrl', ['$scope', '$http', '$stateParams', '$filter', 'cartService', 'alertService', function($scope, $http, $stateParams, $filter, cartService, alertService) {
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
        alertService.addAlert('success', 'Your order was succesfully placed!');
    }
    
}]);

app.controller('OrderCartCtrl', ['$scope', 'cartService', function($scope, cartService) {
    $scope.orders = getItem('orders');
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
    $scope.increaseOrderQty = function(order) {
        order.quantity += 1;
        setItem('orders', cartService.orders)
    }

    $scope.decreaseOrderQty = function(order) {
        order.quantity -= 1;
        setItem('orders', cartService.orders)
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
        cart.orders = [];
        setItem('orders', cart.orders);
    }
    cart.order = function(order_details) {
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

app.factory('alertService', ['$rootScope', function($rootScope) {
    var alertService = {};
    $rootScope.alerts = [];

    alertService.addAlert = function(type, msg) {
        $rootScope.alerts.push({
            'type': type,
            'msg': msg
        });
    };
    $rootScope.addAlert = alertService.addAlert;

    alertService.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };
    $rootScope.closeAlert = alertService.closeAlert;

    return alertService;
}]);