let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
  $routeProvider
    .when('/home', {
      templateUrl: "views/home.html"
    })
    .when('/login', {
      templateUrl: "views/login.html"
    })
    .when('/register', {
      templateUrl: "views/register.html"
    })
    .when('/orders', {
      templateUrl: "views/orders.html"
    })
    .when('/search/:city/:type/:date', {
      templateUrl: "views/search.html"
    })
    .when('/search/:city/:type', {
      templateUrl: "views/search.html"
    })
    .when('/:details/:city/:type/:date', {
      templateUrl: "views/details.html"
    })
    .when('/:details/:city/:type', {
      templateUrl: "views/details.html"
    })
    .otherwise({
      redirectTo: '/home'
    })
}])

app.controller('app-controller', ['$scope', '$http', ($scope, $http) => {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.loaded=false;
  $scope.data = {};
  $scope.data.selectedCurrency = 'PLN';
  $scope.currencyMultiplier = 1;
  $scope.updateCurrency = () => {
    switch ($scope.data.selectedCurrency) {
      case 'PLN': $scope.currencyMultiplier = 1; break;
      case 'EUR': $scope.currencyMultiplier = (1 / 4.42); break;
      case 'USD': $scope.currencyMultiplier = (1 / 3.74); break;
    }
  }
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
  let previousTarget1 = null;
  let previousTarget2 = null;
  let chosenDates = 0;
  $scope.logedAcChange = (value) => {
    $scope.logedAc = value;
    console.log($scope.logedAc);
  }
  $scope.monthOperation2 = () =>{
    $scope.year1 = $scope.date1.substr(8, 4);
      $scope.month1 = $scope.date1.substr(0, 3);
      $scope.month2 = $scope.date2.substr(0, 3);
      $scope.year2 = $scope.date2.substr(8, 4);
  }
  $scope.monthOperation = (value) => {
    if (value === '-') {
      $scope.date1 = moment($scope.date1).subtract(1, 'months').format('ll');
      $scope.date2 = moment($scope.date2).subtract(1, 'months').format('ll');
      $scope.monthOperation2();
    } else if (value === "+") {
      $scope.date1 = moment($scope.date1).add(1, 'months').format('ll');
      $scope.date2 = moment($scope.date2).add(1, 'months').format('ll');
      $scope.monthOperation2();
    }
  }
  $scope.changeStyle = (targetValue,value) =>{
    if(value===1){
      targetValue.style.backgroundColor = 'white';
      targetValue.style.color = 'black';
    }else if(value===2){
      targetValue.style.backgroundColor = "#003580";
      targetValue.style.color = "white";
    }
  }
  $scope.chooseDay = (value, num, e) => {
    if (num === '1') {
      if (chosenDates === 0) {
        if (previousTarget1) {
          $scope.changeStyle(previousTarget1,1);
        }
        previousTarget1 = e.target;
        $scope.checkIn = $scope.month1 + " " + value + ", " + $scope.year1;
        $scope.changeStyle(e.target,2);
        chosenDates++;
      } else if (chosenDates === 1) {
        if (previousTarget2) {
          $scope.changeStyle(previousTarget2,1);
        }
        previousTarget2 = e.target;
        $scope.checkOut = $scope.month1 + " " + value + ", " + $scope.year1;
        $scope.changeStyle(e.target,2);
        chosenDates = 0;
      }
    } else if (num === '2') {
      if (chosenDates === 0) {
        $scope.checkIn = $scope.month2 + " " + value + ", " + $scope.year2;
        $scope.changeStyle(e.target,2);
        chosenDates++;
        if (previousTarget1) {
          $scope.changeStyle(previousTarget1,1);
        }
        previousTarget1 = e.target;
      } else if (chosenDates === 1) {
        $scope.checkOut = $scope.month2 + " " + value + ", " + $scope.year2;
        $scope.changeStyle(e.target,2);
        chosenDates = 0;
        if (previousTarget2) {
          $scope.changeStyle(previousTarget2,1);
        }
        previousTarget2 = e.target;
      }
    }
    if ($scope.checkIn > $scope.checkOut) {
      let tmpDate = $scope.checkIn;
      $scope.checkIn = $scope.checkOut;
      $scope.checkOut = tmpDate;
    }
    $scope.checkInOut = $scope.checkIn + '-' + $scope.checkOut;
    console.log($scope.checkInOut);
  }

  $scope.monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  $scope.num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
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
  $scope.operationFunc = (operation, type) => {
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
  }
  $scope.focusFunc = (e) => {
    if ($scope.data.city === "What is your destination?") {
      $scope.data.city = "";
    }
  }
  $scope.blurFunc = (e) => {
    if ($scope.data.city === "") {
      $scope.data.city = "What is your destination?";
    }
  }
  $scope.showCalendar = () => {
    $scope.calendarVisible = !$scope.calendarVisible;
    $scope.roomSettingsVisible = false;
  }
  $scope.hideCalendar = () => {
    $scope.calendarVisible = false;
    $scope.roomSettingsVisible = false;
  }
  $scope.showRoomsSettings = () => {
    $scope.roomSettingsVisible = !$scope.roomSettingsVisible;
    $scope.calendarVisible = false;
  }
  $scope.displayMessage = (value) => {
    $scope.searchP = value;
    $scope.hideCalendar();
    $scope.roomSettingsVisible = false;
  }
  $scope.searchFilter = () => {
    $scope.searchP = false;
    $scope.found = false;
    for (let item of $scope.hotels) {
      if (item.city.toLowerCase() === $scope.data.city.toLowerCase()) {
        $scope.found = true;
      }
    }
  }
  $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
    $scope.hotels = data.data;
    $scope.loaded=true;
    console.log($scope.hotels);
  })
  $scope.filterFunc = (e, value) => {
    e.target.style.backgroundColor = "green";
    e.target.style.color = "white";
    switch (value) {
      case 1: $scope.order = "-price"; break;
      case 2: $scope.order = "price"; break;
      case 3: $scope.order = "-rating"; break;
      case 4: $scope.order = "rating"; break;
      case 5: $scope.order = "stars"; break;
      case 6: $scope.order = "-stars"; break;
    }
    if ($scope.previousFilterButton) {
      $scope.previousFilterButton.style.backgroundColor = "white";
      $scope.previousFilterButton.style.color = "black";
    }
    $scope.previousFilterButton = e.target;
  }
}])

app.constant("moment", moment);



