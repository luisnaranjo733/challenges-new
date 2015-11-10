'use strict';

var setItem = function(key, value) {
    var json = JSON.stringify(value);
    localStorage.setItem(key, json);
    return value
}

var getItem = function(key) {
    var json = localStorage.getItem(key);
    return JSON.parse(json);
}

var removeItem = function(key) {
    localStorage.removeItem(key);
}

var app = angular.module('CoffeeApp', ['ui.router', 'ui.bootstrap', 'firebase']);

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

}]);

app.controller('OrderCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.categories = ["blends", "dark roast", "espresso", "varietals", "luxury"];
    $http.get('data/products.json').then(function(response) {
        $scope.orders = response.data;
    });
}]);

app.controller('OrderDetailCtrl', ['$scope', '$http', '$stateParams', '$filter', '$location', '$anchorScroll', '$firebaseArray', 'cartService', 'alertService', function($scope, $http, $stateParams, $filter, $location, $anchorScroll, $firebaseArry, cartService, alertService) {
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

        $http.get('data/products.json').then(function(response) {
            var order = $filter('filter')(response.data, {
                id: order_details.id,
            }, true)[0]
            order.quantity = order_details.quantity;
            order.grind_type = order_details.grind_type;
            cartService.order(order);
            alertService.addAlert('success', 'Your order was succesfully placed!');
        });
    }
    $scope.scrollTo = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };
    
}]);

app.controller('OrderCartCtrl', ['$scope', '$uibModal', 'cartService', function($scope, $uibModal, cartService) {
    $scope.orders = cartService.orders;

    $scope.getTotal = function() {
       var grandTotal = 0;
        angular.forEach(cartService.orders, function(order) {
            grandTotal += order.quantity * order.price;
        });
        return grandTotal
    }

    $scope.deleteOrder = function(order) {
        cartService.orders.$remove(order);
    }

    $scope.increaseOrderQty = function(order) {
        if (order.quantity < 10) {
            order.quantity += 1;
            cartService.orders.$save(order);
        }
        
    }

    $scope.decreaseOrderQty = function(order) {
        if (order.quantity > 1) {
            order.quantity -= 1;
            cartService.orders.$save(order);
        }
    }


    $scope.placeOrder = function() {
        //show modal!
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/submit_order_modal.html',
            controller: 'SubmitOrderModalCtrl',
            scope: $scope, //pass in all our scope variables!
        });

        modalInstance.result.catch(function() {
            angular.forEach(cartService.orders, function(order) {
                cartService.orders.$remove(order);
            });
        })

    }

}]);


app.controller('SubmitOrderModalCtrl', function($scope, $uibModalInstance) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})


app.factory('cartService', ['$http', '$filter', '$firebaseArray', function($http, $filter, $firebaseArray) {
    var cart = {};

    var ref = new Firebase("https://blinding-heat-3412.firebaseio.com/data");
    // download the data into a local object
    cart.orders = $firebaseArray(ref);

    cart.order = function(order_details) {
        var match = $filter('filter')(cart.orders, {
            id: order_details.id,
            grind_type: order_details.grind_type
        }, true)[0];

        if (match) { // coalesce
            match.quantity += order_details.quantity
            if (match.quantity > 10) {
                match.quantity = 10;
            }
            cart.orders.$save(match);
        } else {
            cart.orders.$add(order_details);
        }
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