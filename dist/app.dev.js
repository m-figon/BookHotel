"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var app = angular.module('app', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: "views/home.html"
  }).when('/login', {
    templateUrl: "views/login.html"
  }).when('/register', {
    templateUrl: "views/register.html"
  }).when('/orders', {
    templateUrl: "views/orders.html"
  }).when('/search/:city/:type/:date', {
    templateUrl: "views/search.html"
  }).when('/search/:city/:type', {
    templateUrl: "views/search.html"
  }).when('/:details/:city/:type/:date', {
    templateUrl: "views/details.html"
  }).when('/:details/:city/:type', {
    templateUrl: "views/details.html"
  }).otherwise({
    redirectTo: '/home'
  });
}]);
app.controller('app-controller', ['$scope', '$http', function ($scope, $http) {
  //
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.loaded = false;
  $scope.data = {};
  $scope.data.selectedCurrency = 'PLN';
  $scope.currencyMultiplier = 1;

  $scope.updateCurrency = function () {
    switch ($scope.data.selectedCurrency) {
      case 'PLN':
        $scope.currencyMultiplier = 1;
        break;

      case 'EUR':
        $scope.currencyMultiplier = 1 / 4.42;
        break;

      case 'USD':
        $scope.currencyMultiplier = 1 / 3.74;
        break;
    }
  };

  $scope.previousFilterButton;
  $scope.logedAc = "";
  $scope.date1 = moment().format('ll');
  $scope.date2 = moment().add(1, 'months').format('ll');
  $scope.checkIn = "Check In";
  $scope.checkOut = "Check Out";
  $scope.checkInOut = $scope.checkIn + '-' + $scope.checkOut;
  $scope.year1 = $scope.date1.substr(8, 4);
  $scope.month1 = $scope.date1.substr(0, 3);
  $scope.month2 = $scope.date2.substr(0, 3);
  $scope.year2 = $scope.date2.substr(8, 4);
  $scope.order = "";
  var previousTarget1 = null;
  var previousTarget2 = null;
  var chosenDates = 0;

  $scope.logedAcChange = function (value) {
    $scope.logedAc = value;
    console.log($scope.logedAc);
  };

  $scope.monthOperation = function (value) {
    if (value === '-') {
      $scope.date1 = moment($scope.date1).subtract(1, 'months').format('ll');
      $scope.date2 = moment($scope.date2).subtract(1, 'months').format('ll');
      $scope.year1 = $scope.date1.substr(8, 4);
      $scope.month1 = $scope.date1.substr(0, 3);
      $scope.month2 = $scope.date2.substr(0, 3);
      $scope.year2 = $scope.date2.substr(8, 4);
    } else if (value === "+") {
      $scope.date1 = moment($scope.date1).add(1, 'months').format('ll');
      $scope.date2 = moment($scope.date2).add(1, 'months').format('ll');
      $scope.year1 = $scope.date1.substr(8, 4);
      $scope.month1 = $scope.date1.substr(0, 3);
      $scope.month2 = $scope.date2.substr(0, 3);
      $scope.year2 = $scope.date2.substr(8, 4);
    }
  };

  $scope.chooseDay = function (value, num, e) {
    //console.log($scope.month1 + " " + value + ", " + $scope.year1);
    if (num === '1') {
      if (chosenDates === 0) {
        if (previousTarget1) {
          previousTarget1.style.backgroundColor = 'white';
          previousTarget1.style.color = 'black';
        }

        previousTarget1 = e.target;
        $scope.checkIn = $scope.month1 + " " + value + ", " + $scope.year1;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates++;
      } else if (chosenDates === 1) {
        if (previousTarget2) {
          previousTarget2.style.backgroundColor = 'white';
          previousTarget2.style.color = 'black';
        }

        previousTarget2 = e.target;
        $scope.checkOut = $scope.month1 + " " + value + ", " + $scope.year1;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates = 0;
      }
    } else if (num === '2') {
      if (chosenDates === 0) {
        $scope.checkIn = $scope.month2 + " " + value + ", " + $scope.year2;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates++;

        if (previousTarget1) {
          previousTarget1.style.backgroundColor = 'white';
          previousTarget1.style.color = 'black';
        }

        previousTarget1 = e.target;
      } else if (chosenDates === 1) {
        $scope.checkOut = $scope.month2 + " " + value + ", " + $scope.year2;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates = 0;

        if (previousTarget2) {
          previousTarget2.style.backgroundColor = 'white';
          previousTarget2.style.color = 'black';
        }

        previousTarget2 = e.target;
      }
    }

    if ($scope.checkIn > $scope.checkOut) {
      var tmpDate = $scope.checkIn;
      $scope.checkIn = $scope.checkOut;
      $scope.checkOut = tmpDate;
    }

    $scope.checkInOut = $scope.checkIn + '-' + $scope.checkOut;
    console.log($scope.checkInOut);
    console.log($scope.checkIn);
    console.log($scope.checkOut);
  };

  console.log($scope.month1);
  console.log($scope.month2);
  console.log($scope.year1);
  console.log($scope.year2);
  $scope.monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  $scope.num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  $scope.showCalendar = function () {
    $scope.calendarVisible = !$scope.calendarVisible;
  };

  $scope.hideCalendar = function () {
    $scope.calendarVisible = false;
  }; //


  $scope.calendarVisible = false;
  $scope.roomSettingsVisible = false;
  $scope.hotels = [];
  $scope.found = true;
  $scope.searchP = false;
  $scope.data = {
    city: "What is your destination?"
  };
  $scope.adults = 2;
  $scope.children = 0;
  $scope.rooms = 1;

  $scope.operationFunc = function (operation, type) {
    if (type === 'adults') {
      if (operation === '-' && $scope.adults > 1) {
        $scope.adults--;
      } else if (operation === '+') {
        $scope.adults++;
      }
    } else if (type === 'children') {
      if (operation === '-' && $scope.children > 0) {
        $scope.children--;
      } else if (operation === '+') {
        $scope.children++;
      }
    } else if (type === 'rooms') {
      if (operation === '-' && $scope.rooms > 1) {
        $scope.rooms--;
      } else if (operation === '+') {
        $scope.rooms++;
      }
    }
  };

  $scope.focusFunc = function (e) {
    if ($scope.data.city === "What is your destination?") {
      $scope.data.city = "";
    }
  };

  $scope.blurFunc = function (e) {
    if ($scope.data.city === "") {
      $scope.data.city = "What is your destination?";
    }
  };

  $scope.showCalendar = function () {
    $scope.calendarVisible = !$scope.calendarVisible;
    $scope.roomSettingsVisible = false;
  };

  $scope.showRoomsSettings = function () {
    $scope.roomSettingsVisible = !$scope.roomSettingsVisible;
    $scope.calendarVisible = false;
  };

  $scope.displayMessage = function (value) {
    $scope.searchP = value;
    $scope.hideCalendar();
  };

  $scope.searchFilter = function () {
    $scope.searchP = false;
    $scope.found = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = $scope.hotels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        if (item.city.toLowerCase() === $scope.data.city.toLowerCase()) {
          $scope.found = true;
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

    console.log($scope.found);
  };

  $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then(function (data) {
    $scope.hotels = data.data;
    $scope.loaded = true;
    console.log($scope.hotels);
  });

  $scope.filterFunc = function (e, value) {
    e.target.style.backgroundColor = "green";
    e.target.style.color = "white";

    switch (value) {
      case 1:
        $scope.order = "-price";
        break;

      case 2:
        $scope.order = "price";
        break;

      case 3:
        $scope.order = "-rating";
        break;

      case 4:
        $scope.order = "rating";
        break;

      case 5:
        $scope.order = "stars";
        break;

      case 6:
        $scope.order = "-stars";
        break;
    }

    if ($scope.previousFilterButton) {
      $scope.previousFilterButton.style.backgroundColor = "white";
      $scope.previousFilterButton.style.color = "black";
    }

    $scope.previousFilterButton = e.target;
  };
}]);
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
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = months.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = _slicedToArray(_step2.value, 2),
            key = _step2$value[0],
            item = _step2$value[1];

        if (item === $scope.$parent.checkOut.substr(0, 3)) {
          second = key;
        }

        if (item === $scope.$parent.checkIn.substr(0, 3)) {
          first = key;
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

    if (second === first) {
      $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
    } else if (second === first + 1) {
      $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
      $scope.timeDifference += 30;
    }

    console.log($scope.timeDifference);
  }

  $scope.reserveFunc = function () {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
      var users = data.data;
      var user = null;
      var newOrders = null;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = users[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _item = _step3.value;

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
    });
  };
}]);
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

  console.log($scope.opinionNumbers);

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
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = hotels[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var item = _step4.value;

              if (item.name === $routeParams.details) {
                $scope.hotel = item;
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
      });
    } else {
      $scope.wrongOpinion = true;
    }
  };

  if ($routeParams.details) {
    console.log($routeParams.details);
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then(function (data) {
      var hotels = data.data;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = hotels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var item = _step5.value;

          if (item.name === $routeParams.details) {
            $scope.hotel = item;
            $scope.detailsLoaded = true;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
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
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = months.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _step6$value = _slicedToArray(_step6.value, 2),
            key = _step6$value[0],
            item = _step6$value[1];

        if (item === $scope.$parent.checkOut.substr(0, 3)) {
          second = key;
        }

        if (item === $scope.$parent.checkIn.substr(0, 3)) {
          first = key;
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
          _iterator6["return"]();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    if (second === first) {
      $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
    } else if (second === first + 1) {
      $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2));
      $scope.timeDifference2 += 30;
    }

    console.log($scope.timeDifference2);
  }

  $scope.addConfirmShow = function (value) {
    $scope.addConfirm = value;
  };

  $scope.reserveFunc = function () {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
      var users = data.data;
      var user = null;
      var newOrders = null;
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = users[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _item2 = _step7.value;

          if ($scope.logedAc === _item2.firstName + " " + _item2.lastName) {
            user = _item2;
            newOrders = _item2.orders.slice();
            console.log($scope.hotel);
            console.log($scope.timeDifference2 + "," + $scope.hotel.price + "," + $scope.currencyMultiplier + "," + $scope.$parent.rooms + "," + $scope.data.selectedCurrency);
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
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    });
  };
}]);
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
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = users[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var item = _step8.value;

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
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      if (!correct) {
        $scope.loginP = true;
      }
    });
  };
}]);
app.controller('orders-controller', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
  $scope.logedUser = null;
  $scope.deleteConfirm = false;
  $scope.tmpId = null;
  $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then(function (data) {
    var users = data.data;
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = users[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var item = _step9.value;

        if ($scope.logedAc === item.firstName + " " + item.lastName) {
          $scope.logedUser = item;
          console.log($scope.logedUser);
          console.log($scope.logedUser.orders);
        }
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
          _iterator9["return"]();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
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
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = users[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var item = _step10.value;

            if ($scope.logedAc === item.firstName + " " + item.lastName) {
              $scope.logedUser = item;
              console.log($scope.logedUser);
              console.log($scope.logedUser.orders);
              $scope.deleteConfirmShow(false, null);
            }
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
              _iterator10["return"]();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
          }
        }
      });
    });
  };
}]);
app.controller('register-controller', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
  $scope.email = "";
  $scope.firstName = "";
  $scope.lastName = "";
  $scope.emailP = false;
  $scope.firstNameP = false;
  $scope.lastNameP = false;
  $scope.password1P = false;
  $scope.password2P = false;
  $scope.part = '1';
  $scope.password1 = "";
  $scope.password2 = "";

  $scope.goNext = function (value) {
    if (value === '2') {
      console.log('gonext');

      if (!($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) === null)) {
        $scope.emailP = false;
        $scope.part = '2';
      } else {
        $scope.emailP = true;
      }
    } else if (value === '3') {
      if (!($scope.password1.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/) === null)) {
        $scope.password1P = false;
      } else {
        $scope.password1P = true;
      }

      if (!($scope.password1.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/) === null) && $scope.password1 === $scope.password2) {
        $scope.password2P = false;
      } else {
        $scope.password2P = true;
      }

      if (!$scope.password2P && !$scope.password1P) {
        $scope.part = '3';
      }
    } else if (value === '4') {
      var correctNames = true;

      if (!($scope.firstName.match(/^[a-zA-Z]{4,10}$/) === null)) {
        $scope.firstNameP = false;
      } else {
        $scope.firstNameP = true;
        correctNames = false;
      }

      if (!($scope.lastName.match(/^[a-zA-Z]{4,10}$/) === null)) {
        $scope.lastNameP = false;
      } else {
        $scope.lastNameP = true;
        correctNames = false;
      }

      if (correctNames) {
        $http.post('https://rocky-citadel-32862.herokuapp.com/BookHotel/users', {
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          email: $scope.email,
          password: $scope.password1,
          orders: []
        }).then(function () {
          alert('account created');
        });
      }
    }
  };
}]);
app.constant("moment", moment);