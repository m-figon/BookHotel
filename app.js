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
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.timeDifference = null;
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
  $scope.order="";
  let previousTarget1 = null;
  let previousTarget2 = null;
  let chosenDates = 0;
  $scope.logedAcChange = (value) => {
    $scope.logedAc = value;
    console.log($scope.logedAc);
  }
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
      let tmpDate = $scope.checkIn;
      $scope.checkIn = $scope.checkOut;
      $scope.checkOut = tmpDate;
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
  $scope.filterFunc = (e,value) =>{
    e.target.style.backgroundColor="green";
    e.target.style.color="white";
    switch(value){
      case 1: $scope.order="-price"; break;
      case 2: $scope.order="price"; break;
      case 3: $scope.order="-rating"; break;
      case 4: $scope.order="rating"; break;
      case 5: $scope.order="stars"; break;
      case 6: $scope.order="-stars"; break;
    }
    if($scope.previousFilterButton){
      $scope.previousFilterButton.style.backgroundColor="white";
      $scope.previousFilterButton.style.color="black";
    }
    $scope.previousFilterButton=e.target;
  }
}])

app.controller('search-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.cityFilter = "";
  $scope.adultsNum = null;
  $scope.childrenNum = null;
  $scope.roomsNum = null;
  $scope.firstDate = "Check In";
  $scope.secondDate = "Check Out";
  $scope.checkInOut2;
  let chosenDates2=0;
  let previousTarget1 = null;
  let previousTarget2 = null;
  $scope.date3 = moment().format('ll');
  $scope.date4 = moment().add(1, 'months').format('ll');
  $scope.checkInOut2 = $scope.firstDate + '-' + $scope.secondDate;
  $scope.year3 = $scope.date3.substr(8, 4);
  $scope.month3 = $scope.date3.substr(0, 3);
  $scope.month4 = $scope.date4.substr(0, 3);
  $scope.year4 = $scope.date4.substr(8, 4);
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
    let first = 0;
    let second = 0;
    for (let [key, item] of months.entries()) {
      if (item === $scope.secondDate.substr(0, 3)) {
        second = key;

      } if (item === $scope.firstDate.substr(0, 3)) {
        first = key;
      }
    }
    if (second === first) {
      $scope.timeDifference = parseInt($scope.secondDate.substr(4, 2)) - parseInt($scope.firstDate.substr(4, 2))
    } else if (second === first + 1) {
      $scope.timeDifference = parseInt($scope.secondDate.substr(4, 2)) - parseInt($scope.firstDate.substr(4, 2))
      $scope.timeDifference += 30;
    }
    console.log($scope.timeDifference);
  }
  $scope.monthOperation2 = (value) => {
    if (value === '-') {
      $scope.date3 = moment($scope.date3).subtract(1, 'months').format('ll');
      $scope.date4 = moment($scope.date4).subtract(1, 'months').format('ll');
      $scope.year3 = $scope.date3.substr(8, 4);
      $scope.month3 = $scope.date3.substr(0, 3);
      $scope.month4 = $scope.date4.substr(0, 3);
      $scope.year4 = $scope.date4.substr(8, 4);
    } else if (value === "+") {
      $scope.date3 = moment($scope.date3).add(1, 'months').format('ll');
      $scope.date4 = moment($scope.date4).add(1, 'months').format('ll');
      $scope.year3 = $scope.date3.substr(8, 4);
      $scope.month3 = $scope.date3.substr(0, 3);
      $scope.month4 = $scope.date4.substr(0, 3);
      $scope.year4 = $scope.date4.substr(8, 4);
    }
  }
  $scope.chooseDay2 = (value, num, e) => {
    console.log($scope.month3 + " " + value + ", " + $scope.year3);
    $scope.firstDate = $scope.month3 + " " + value + ", " + $scope.year3;
    if (num === '1') {
      if (chosenDates2 === 0) {
        if (previousTarget1) {
          previousTarget1.style.backgroundColor = 'white';
          previousTarget1.style.color = 'black';
        }
        previousTarget1 = e.target;
        $scope.firstDate = $scope.month3 + " " + value + ", " + $scope.year3;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates2++;
      } else if (chosenDates2 === 1) {
        if (previousTarget2) {
          previousTarget2.style.backgroundColor = 'white';
          previousTarget2.style.color = 'black';
        }
        previousTarget2 = e.target;
        $scope.secondDate = $scope.month3 + " " + value + ", " + $scope.year3;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates2 = 0;
      }
    } else if (num === '2') {
      if (chosenDates2 === 0) {
        $scope.firstDate = $scope.month4 + " " + value + ", " + $scope.year4;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates2++;
        if (previousTarget1) {
          previousTarget1.style.backgroundColor = 'white';
          previousTarget1.style.color = 'black';
        }
        previousTarget1 = e.target;
      } else if (chosenDates2 === 1) {
        $scope.secondDate = $scope.month4 + " " + value + ", " + $scope.year4;
        e.target.style.backgroundColor = "#003580";
        e.target.style.color = "white";
        chosenDates2 = 0;
        if (previousTarget2) {
          previousTarget2.style.backgroundColor = 'white';
          previousTarget2.style.color = 'black';
        }
        previousTarget2 = e.target;
      }
    }
    if ($scope.firstDate > $scope.secondDate) {
      let tmpDate = $scope.firstDate;
      $scope.firstDate = $scope.secondDate;
      $scope.secondDate = tmpDate;
    }
    $scope.checkInOut2 = $scope.firstDate + '-' + $scope.secondDate;
    console.log($scope.checkInOut2);
  }
  
}])

app.controller('details-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
  $scope.hotel;
  if ($routeParams.details) {
    console.log($routeParams.details);
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
      let hotels = data.data;
      for (let item of hotels) {
        if (item.name === $routeParams.details) {
          $scope.hotel = item;
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
    console.log($scope.firstDate2);
    console.log($scope.secondDate2);
  }
}])

app.controller('login-controller', ['$scope', '$http', '$routeParams', '$location', ($scope, $http, $routeParams, $location) => {
  $scope.email = "";
  $scope.loginP = false;
  $scope.part = '1';
  $scope.password = "";
  $scope.goNext = () => {
    if (!($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) ===
      null)) {
      $scope.part = "2";
      $scope.loginP = false;
    } else {
      $scope.loginP = true;
    }
  }
  $scope.loginFunc = () => {

    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then((data) => {
      let users = data.data;
      let correct = false;
      for (let item of users) {
        if (item.email === $scope.email && item.password === $scope.password) {
          correct = true;
          $scope.loginP = false;
          $scope.$parent.logedAcChange(item.account);
          alert('you logged');
          $scope.email = "";
          $scope.loginP = false;
          $scope.part = '1';
          $scope.password = "";
          $location.path('/home');
        }
      }
      if (!correct) {
        $scope.loginP = true;
      }
    })
  }
}])

app.controller('register-controller', ['$scope', '$http', '$routeParams', '$location', ($scope, $http, $routeParams, $location) => {
  $scope.email = "";
  $scope.emailP = false;
  $scope.accountP = false;
  $scope.password1P = false;
  $scope.password2P = false;
  $scope.part = '1';
  $scope.password1 = "";
  $scope.password2 = "";

  $scope.goNext = (value) => {
    if (value === '2') {
      console.log('gonext')
      if (!($scope.email.match(/^[a-z0-9\._\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$/) ===
        null)) {
        $scope.emailP = false;
        $scope.part = '2';
      } else {
        $scope.emailP = true;
      }
    } else if (value === '3') {
      if (!($scope.password1.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/
      ) ===
        null)) {
        $scope.password1P = false;
      } else {
        $scope.password1P = true;
      }
      if (!($scope.password1.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\.\-_@$!%*#?&])[A-Za-z\d\.\-_@$!%*#?&]{8,13}$/
      ) ===
        null) && ($scope.password1 === $scope.password2)) {
        $scope.password2P = false;
      } else {
        $scope.password2P = true;
      }
      if (!$scope.password2P && !$scope.password1P) {
        $scope.part = '3';
      }
    } else if (value === '4') {
      if (!($scope.account.match(/^[a-zA-Z0-9\.\-_]{4,10}$/) === null)) {
        $scope.accountP = false;
        $http.post('https://rocky-citadel-32862.herokuapp.com/BookHotel/users', {
          account: $scope.account,
          email: $scope.email,
          password: $scope.password1,
          orders: []
        }).then(() => {
          alert('account created');
        })
      } else {
        $scope.accountP = true;
      }
    }

  }
}])

app.constant("moment", moment);



