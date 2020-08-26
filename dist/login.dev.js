"use strict";

app.controller('login-controller', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
  $scope.email = "";
  $scope.loginP = false;
  $scope.part = '1';
  $scope.password = "";

  $scope.goNext = function () {
    if (!($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) === null)) {
      $scope.part = "2";
      $scope.loginP = false;
    } else {
      $scope.loginP = true;
    }
  };

  $scope.loginFunc = function () {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
      var users = data.data;
      var correct = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (item.email === $scope.email && item.password === $scope.password) {
            correct = true;
            $scope.loginP = false;
            $scope.$parent.logedAcChange(item.firstName + " " + item.lastName);
            alert('you logged');
            $scope.email = "";
            $scope.loginP = false;
            $scope.part = '1';
            $scope.password = "";
            $location.path('/home');
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

      if (!correct) {
        $scope.loginP = true;
      }
    });
  };
}]);