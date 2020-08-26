"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

app.controller('details-controller', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
  $scope.hotel;
  $scope.detailsLoaded = false;
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.opinion = "Enter Opinion";
  $scope.rating = "none";
  $scope.wrongOpinion = false;
  $scope.opinionNumbers = [];

  for (var i = 0; i < 21; i++) {
    $scope.opinionNumbers.push(i * 0.5);
  }

  $scope.opinionFocusFunc = function (e) {
    if ($scope.opinion === "Enter Opinion") {
      $scope.opinion = "";
    }
  };

  $scope.opinionBlurFunc = function (e) {
    if ($scope.opinion === "") {
      $scope.opinion = "Enter Opinion";
    }
  };

  $scope.addOpinion = function () {
    $scope.wrongOpinion = false;

    if ($scope.opinion !== "Enter Opinion" && $scope.rating !== "none") {
      var tmpOpinions = $scope.hotel.opinions.slice();
      tmpOpinions.push({
        rating: $scope.rating,
        opinion: $scope.opinion,
        author: $scope.logedAc
      });
      $http.put('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels/' + $scope.hotel.id, {
        name: $scope.hotel.name,
        price: $scope.hotel.price,
        stars: $scope.hotel.stars,
        img: $scope.hotel.img,
        city: $scope.hotel.city,
        freeRooms: $scope.hotel.freeRooms,
        shortDescription: $scope.hotel.shortDescription,
        longDescription: $scope.hotel.longDescription,
        rating: $scope.hotel.rating,
        opinions: tmpOpinions,
        id: $scope.hotel.id
      }).then(function () {
        $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then(function (data) {
          var hotels = data.data;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = hotels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;

              if (item.name === $routeParams.details) {
                $scope.hotel = item;
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
      });
    } else {
      $scope.wrongOpinion = true;
    }
  };

  if ($routeParams.details) {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then(function (data) {
      var hotels = data.data;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = hotels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          if (item.name === $routeParams.details) {
            $scope.hotel = item;
            $scope.detailsLoaded = true;
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
  }

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
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = months.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _step3$value = _slicedToArray(_step3.value, 2),
            key = _step3$value[0],
            item = _step3$value[1];

        if (item === $scope.$parent.checkOut.substr(0, 3)) {
          second = key;
        }

        if (item === $scope.$parent.checkIn.substr(0, 3)) {
          first = key;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (second === first) {
      $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
    } else if (second === first + 1) {
      $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
      $scope.timeDifference2 += 30;
    }
  }

  $scope.addConfirmShow = function (value) {
    $scope.addConfirm = value;
  };

  $scope.reserveFunc = function () {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
      var users = data.data;
      var user = null;
      var newOrders = null;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = users[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _item = _step4.value;

          if ($scope.logedAc === _item.firstName + " " + _item.lastName) {
            user = _item;
            newOrders = _item.orders.slice();
            newOrders.push({
              name: $scope.hotel.name,
              city: $scope.hotel.city,
              img: $scope.hotel.img,
              rating: $scope.hotel.rating,
              totalPrice: Math.round($scope.timeDifference2 * $scope.hotel.price * $scope.currencyMultiplier * $scope.$parent.rooms * 100) / 100 + $scope.data.selectedCurrency,
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
              $http.put('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels/' + $scope.hotel.id, {
                name: $scope.hotel.name,
                price: $scope.hotel.price,
                stars: $scope.hotel.stars,
                img: $scope.hotel.img,
                city: $scope.hotel.city,
                freeRooms: $scope.hotel.freeRooms - 1,
                shortDescription: $scope.hotel.shortDescription,
                longDescription: $scope.hotel.longDescription,
                rating: $scope.hotel.rating,
                opinions: $scope.hotel.opinions,
                id: $scope.hotel.id
              }).then(function () {
                $scope.addConfirmShow(false);
                alert('you reserved!');
              });
            });
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    });
  };
}]);