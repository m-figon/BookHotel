"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

app.controller('search-controller', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
  $scope.addConfirm = false;
  $scope.timeDifference = null;
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.tmpObj = null;

  $scope.addConfirmShow = function (value, obj) {
    $scope.tmpObj = obj;
    $scope.addConfirm = value;
  };

  $scope.selectArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  if ($routeParams.city) {
    $scope.$parent.data.city = $routeParams.city;
  }

  if ($routeParams.type) {
    var tmpType = $routeParams.type.split('-');
    $scope.$parent.adults = tmpType[0];
    $scope.$parent.children = tmpType[1];
    $scope.$parent.rooms = tmpType[2];
  }

  if ($routeParams.date) {
    var tmpDate = $routeParams.date.split('-');
    $scope.$parent.checkIn = tmpDate[0];
    $scope.$parent.checkOut = tmpDate[1];
    var first = 0;
    var second = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = months.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            item = _step$value[1];

        if (item === $scope.$parent.checkOut.substr(0, 3)) {
          second = key;
        }

        if (item === $scope.$parent.checkIn.substr(0, 3)) {
          first = key;
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

    if (second === first) {
      $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
    } else if (second === first + 1) {
      $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
      $scope.timeDifference += 30;
    }
  }

  $scope.reserveFunc = function () {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
      var users = data.data;
      var user = null;
      var newOrders = null;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = users[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _item = _step2.value;

          if ($scope.logedAc === _item.firstName + " " + _item.lastName) {
            user = _item;
            newOrders = _item.orders.slice();
            console.log($scope.tmpObj);
            newOrders.push({
              name: $scope.tmpObj.name,
              city: $scope.tmpObj.city,
              img: $scope.tmpObj.img,
              rating: $scope.tmpObj.rating,
              totalPrice: Math.round($scope.timeDifference * $scope.tmpObj.price * $scope.currencyMultiplier * $scope.$parent.rooms * 100) / 100 + $scope.data.selectedCurrency,
              rooms: $scope.$parent.rooms,
              adults: $scope.$parent.adults,
              children: $scope.$parent.children,
              date: $scope.$parent.checkIn + "-" + $scope.$parent.checkOut
            });
            $http.put('https://rocky-citadel-32862.herokuapp.com/BookHotel/users/' + user.id, {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              password: user.password,
              orders: newOrders,
              id: user.id
            }).then(function () {
              $http.put('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels/' + $scope.tmpObj.id, {
                name: $scope.tmpObj.name,
                price: $scope.tmpObj.price,
                stars: $scope.tmpObj.stars,
                img: $scope.tmpObj.img,
                city: $scope.tmpObj.city,
                freeRooms: $scope.tmpObj.freeRooms - 1,
                shortDescription: $scope.tmpObj.shortDescription,
                longDescription: $scope.tmpObj.longDescription,
                rating: $scope.tmpObj.rating,
                opinions: $scope.tmpObj.opinions,
                id: $scope.tmpObj.id
              }).then(function () {
                $scope.addConfirmShow(false, null);
                alert('you reserved!');
              });
            });
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
  };
}]);