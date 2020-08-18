let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
  $routeProvider
    .when('/home', {
      templateUrl: "views/home.html"
    })
    .when('/login', {
      templateUrl: "views/login.html"
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
  //
  $scope.firstDate = "Check In";
  $scope.secondDate = "Check Out";
  $scope.firstDate2 = "Check In";
  $scope.secondDate2 = "Check Out";
  $scope.date1 = moment().format('ll');
  $scope.date2 = moment().add(1, 'months').format('ll');
  $scope.checkIn = "Check In";
  $scope.checkOut = "Check Out";
  $scope.checkInOut = $scope.checkIn + '-' + $scope.checkOut;
  $scope.year1 = $scope.date1.substr(8, 4);
  $scope.month1 = $scope.date1.substr(0, 3);
  $scope.month2 = $scope.date2.substr(0, 3);
  $scope.year2 = $scope.date2.substr(8, 4);
  let previousTarget1 = null;
  let previousTarget2 = null;
  let chosenDates = 0;
  $scope.monthOperation = (value) => {
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
  }
  $scope.chooseDay = (value, num, e) => {
    console.log($scope.month1 + " " + value + ", " + $scope.year1);
    if (num === '1') {
      if (chosenDates === 0) {
        if (previousTarget1) {
          previousTarget1.style.backgroundColor = 'white';
          previousTarget1.style.color = 'black';
        }
        previousTarget1 = e.target;
        $scope.checkIn = $scope.month1 + " " + value + ", " + $scope.year1;
        $scope.firstDate = $scope.month1 + " " + value + ", " + $scope.year1;
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
        $scope.secondDate = $scope.month1 + " " + value + ", " + $scope.year1;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates = 0;
      }
    } else if (num === '2') {
      if (chosenDates === 0) {
        $scope.checkIn = $scope.month2 + " " + value + ", " + $scope.year2;
        $scope.firstDate = $scope.month2 + " " + value + ", " + $scope.year2;
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
        $scope.secondDate = $scope.month2 + " " + value + ", " + $scope.year2;
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
      let tmpDate = $scope.checkIn;
      $scope.checkIn = $scope.checkOut;
      $scope.checkOut = tmpDate;
    } if ($scope.firstDate > $scope.secondDate) {
      let tmpDate = $scope.secondDate;
      $scope.firstDate = $scope.secondDate;
      $scope.secondDate = tmpDate;
    }
    $scope.checkInOut = $scope.checkIn + '-' + $scope.checkOut;

  }
  console.log($scope.month1);
  console.log($scope.month2);
  console.log($scope.year1);
  console.log($scope.year2);

  $scope.monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  $scope.num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  $scope.showCalendar = () => {
    $scope.calendarVisible = !$scope.calendarVisible;
  }
  //
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
  $scope.showRoomsSettings = () => {
    $scope.roomSettingsVisible = !$scope.roomSettingsVisible;
    $scope.calendarVisible = false;
  }
  $scope.displayMessage = () => {
    $scope.searchP = true;
  }
  $scope.searchFilter = () => {
    $scope.searchP = false;
    $scope.found = false;
    for (let item of $scope.hotels) {
      if (item.city.toLowerCase() === $scope.data.city.toLowerCase()) {
        $scope.found = true;
      }
    }
    console.log($scope.found);
  }
  $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
    $scope.hotels = data.data;
    console.log($scope.hotels);
  })
}])

app.controller('search-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
  $scope.cityFilter = "";
  $scope.adultsNum = null;
  $scope.childrenNum = null;
  $scope.roomsNum = null;
  $scope.selectArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  if ($routeParams.city) {
    $scope.cityFilter = $routeParams.city;
  }
  if ($routeParams.type) {
    let tmpType = $routeParams.type.split('-');
    $scope.adultsNum = tmpType[0];
    $scope.childrenNum = tmpType[1];
    $scope.roomsNum = tmpType[2];
    console.log($scope.adultsNum);
  }
  if ($routeParams.date) {
    let tmpDate = $routeParams.date.split('-');
    $scope.firstDate = tmpDate[0];
    $scope.secondDate = tmpDate[1];
    console.log($scope.firstDate);
    console.log($scope.secondDate);
  }
}])

app.controller('details-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
  $scope.hotel;
  if ($routeParams.details) {
    console.log($routeParams.details);
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
    let hotels = data.data;
    for(let item of hotels){
      if(item.name===$routeParams.details){
        $scope.hotel=item;
      }
    }
  })
  }
  $scope.cityFilter2 = "";
  $scope.adultsNum2 = null;
  $scope.childrenNum2 = null;
  $scope.roomsNum2 = null;
  $scope.selectArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  if ($routeParams.city) {
    $scope.cityFilter2 = $routeParams.city;
  }
  if ($routeParams.type) {
    let tmpType = $routeParams.type.split('-');
    $scope.adultsNum2 = tmpType[0];
    $scope.childrenNum2 = tmpType[1];
    $scope.roomsNum2 = tmpType[2];
    console.log($scope.adultsNum);
  }
  if ($routeParams.date) {
    let tmpDate = $routeParams.date.split('-');
    $scope.firstDate2 = tmpDate[0];
    $scope.secondDate2 = tmpDate[1];
    console.log($scope.firstDate);
    console.log($scope.secondDate);
  }
}])

app.controller('login-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
  $scope.email="mateusz.figon97@gmail.com";
  $scope.part='1';
  $scope.password="";
  $scope.goNext = () =>{
    $scope.part="2";
  }
  $scope.loginFunc = () =>{
    alert('you logged');
  }
}])

app.constant("moment", moment);



