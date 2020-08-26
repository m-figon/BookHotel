"use strict";

app.controller('orders-controller', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
  $scope.logedUser = null;
  $scope.deleteConfirm = false;
  $scope.tmpId = null;
  $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
    var users = data.data;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        if ($scope.$parent.logedAc === item.firstName + " " + item.lastName) {
          $scope.logedUser = item;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });

  $scope.deleteConfirmShow = function (value, id) {
    $scope.tmpId = id;
    $scope.deleteConfirm = value;
  };

  $scope.deleteOrder = function () {
    var newOrders = $scope.logedUser.orders.slice();
    newOrders.splice($scope.tmpId, 1);
    $http.put('https://rocky-citadel-32862.herokuapp.com/BookHotel/users/' + $scope.logedUser.id, {
      email: $scope.logedUser.email,
      firstName: $scope.logedUser.firstName,
      lastName: $scope.logedUser.lastName,
      password: $scope.logedUser.password,
      orders: newOrders,
      id: $scope.logedUser.id
    }).then(function () {
      $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
        var users = data.data;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = users[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            if ($scope.$parent.logedAc === item.firstName + " " + item.lastName) {
              $scope.logedUser = item;
              $scope.deleteConfirmShow(false, null);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });
    });
  };
}]);