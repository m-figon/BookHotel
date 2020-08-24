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
  //
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
      let tmpDate = $scope.checkIn;
      $scope.checkIn = $scope.checkOut;
      $scope.checkOut = tmpDate;
    }
    $scope.checkInOut = $scope.checkIn + '-' + $scope.checkOut;
    console.log($scope.checkInOut);
    console.log($scope.checkIn);
    console.log($scope.checkOut)
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
  $scope.hideCalendar = () => {
    $scope.calendarVisible = false;
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
  $scope.displayMessage = (value) => {
    $scope.searchP = value;
    $scope.hideCalendar();
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

app.controller('search-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
  $scope.addConfirm=false;
  $scope.timeDifference = null;
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.tmpObj=null;
  $scope.addConfirmShow = (value,obj) =>{
    $scope.tmpObj=obj;
    $scope.addConfirm = value;
  }
  $scope.selectArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  if ($routeParams.city) {
    $scope.$parent.data.city = $routeParams.city;
  }
  if ($routeParams.type) {
    let tmpType = $routeParams.type.split('-');
    $scope.$parent.adults = tmpType[0];
    $scope.$parent.children = tmpType[1];
    $scope.$parent.rooms = tmpType[2];
  }
  if ($routeParams.date) {
    let tmpDate = $routeParams.date.split('-');
    $scope.$parent.checkIn = tmpDate[0];
    $scope.$parent.checkOut = tmpDate[1];
    let first = 0;
    let second = 0;
    for (let [key, item] of months.entries()) {
      if (item === $scope.$parent.checkOut.substr(0, 3)) {
        second = key;

      } if (item ===$scope.$parent.checkIn.substr(0, 3)) {
        first = key;
      }
    }
    if (second === first) {
      $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
    } else if (second === first + 1) {
      $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
      $scope.timeDifference += 30;
    }
    console.log($scope.timeDifference);
  }
  $scope.reserveFunc = () => {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then((data) => {
      let users = data.data;
      let user = null;
      let newOrders = null;
      for (let item of users) {
        if ($scope.logedAc === item.firstName + " " + item.lastName) {
          user = item;
          newOrders = item.orders.slice();
          console.log($scope.tmpObj);
          newOrders.push({
            name: $scope.tmpObj.name,
            city: $scope.tmpObj.city,
            img: $scope.tmpObj.img,
            rating: $scope.tmpObj.rating,
            totalPrice: (Math.round(($scope.timeDifference * $scope.tmpObj.price * $scope.currencyMultiplier * $scope.$parent.rooms) * 100) / 100) + $scope.data.selectedCurrency,
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
          }).then(() => {
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
            }).then(() => {
              $scope.addConfirmShow(false,null);

              alert('you reserved!');
            })
          })
        }
      }
    })

  }

}])

app.controller('details-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
  $scope.hotel;
  $scope.detailsLoaded=false;
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.opinion = "Enter Opinion";
  $scope.rating = "none";
  $scope.wrongOpinion = false;
  $scope.opinionNumbers = [];
  for (let i = 0; i < 21; i++) {
    $scope.opinionNumbers.push(i * 0.5);
  }
  console.log($scope.opinionNumbers);
  $scope.opinionFocusFunc = (e) => {
    if ($scope.opinion === "Enter Opinion") {
      $scope.opinion = "";
    }
  }
  $scope.opinionBlurFunc = (e) => {
    if ($scope.opinion === "") {
      $scope.opinion = "Enter Opinion";
    }
  }
  $scope.addOpinion = () => {
    $scope.wrongOpinion = false;
    if ($scope.opinion !== "Enter Opinion" && $scope.rating !== "none") {
      let tmpOpinions = $scope.hotel.opinions.slice();
      tmpOpinions.push({
        rating: $scope.rating,
        opinion: $scope.opinion,
        author: $scope.logedAc
      })
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

      }).then(() => {
        $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
          let hotels = data.data;
          for (let item of hotels) {
            if (item.name === $routeParams.details) {
              $scope.hotel = item;
            }
          }
        })
      })
    } else {
      $scope.wrongOpinion = true;
    }

  }
  if ($routeParams.details) {
    console.log($routeParams.details);
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
      let hotels = data.data;
      for (let item of hotels) {
        if (item.name === $routeParams.details) {
          $scope.hotel = item;
          $scope.detailsLoaded=true;
        }
      }
    })
  }
  $scope.selectArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  if ($routeParams.city) {
    $scope.$parent.data.city = $routeParams.city;
  }
  if ($routeParams.type) {
    let tmpType = $routeParams.type.split('-');
    $scope.$parent.adults = tmpType[0];
    $scope.$parent.children = tmpType[1];
    $scope.$parent.rooms = tmpType[2];
  }
  if ($routeParams.date) {
    let tmpDate = $routeParams.date.split('-');
    $scope.$parent.checkIn = tmpDate[0];
    $scope.$parent.checkOut = tmpDate[1];
    let first = 0;
    let second = 0;
    for (let [key, item] of months.entries()) {
      if (item === $scope.$parent.checkOut.substr(0, 3)) {
        second = key;

      } if (item ===  $scope.$parent.checkIn.substr(0, 3)) {
        first = key;
      }
    }
    if (second === first) {
      $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
    } else if (second === first + 1) {
      $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
      $scope.timeDifference2 += 30;
    }
    console.log($scope.timeDifference2);
  }
  $scope.addConfirmShow = (value) =>{
    $scope.addConfirm = value;
  }
  $scope.reserveFunc = () => {
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then((data) => {
      let users = data.data;
      let user = null;
      let newOrders = null;
      for (let item of users) {
        if ($scope.logedAc === item.firstName + " " + item.lastName) {
          user = item;
          newOrders = item.orders.slice();
          console.log($scope.hotel);
          console.log($scope.timeDifference2 + "," + $scope.hotel.price + "," + $scope.currencyMultiplier + "," + $scope.$parent.rooms + "," + $scope.data.selectedCurrency)
          newOrders.push({
            name: $scope.hotel.name,
            city: $scope.hotel.city,
            img: $scope.hotel.img,
            rating: $scope.hotel.rating,
            totalPrice: (Math.round(($scope.timeDifference2 * $scope.hotel.price * $scope.currencyMultiplier * $scope.$parent.rooms) * 100) / 100) + $scope.data.selectedCurrency,
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
          }).then(() => {
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
            }).then(() => {
              $scope.addConfirmShow(false);
              alert('you reserved!');
            })
          })
        }
      }
    })

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
          $scope.$parent.logedAcChange(item.firstName + " " + item.lastName);
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

app.controller('orders-controller', ['$scope', '$http', '$routeParams', '$location', ($scope, $http, $routeParams, $location) => {
  $scope.logedUser = null;
  $scope.deleteConfirm=false;
  $scope.tmpId=null;
  $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then((data) => {
    let users = data.data;
    for (let item of users) {
      if ($scope.logedAc === item.firstName + " " + item.lastName) {
        $scope.logedUser = item;
        console.log($scope.logedUser);
        console.log($scope.logedUser.orders);
      }
    }
  })
  $scope.deleteConfirmShow = (value,id) =>{
    $scope.tmpId=id;
    $scope.deleteConfirm = value;
  }
  $scope.deleteOrder = () => {
    let newOrders = $scope.logedUser.orders.slice();
    newOrders.splice($scope.tmpId,1);
    $http.put('https://rocky-citadel-32862.herokuapp.com/BookHotel/users/' + $scope.logedUser.id, {
      email: $scope.logedUser.email,
      firstName: $scope.logedUser.firstName,
      lastName: $scope.logedUser.lastName,
      password: $scope.logedUser.password,
      orders: newOrders,
      id: $scope.logedUser.id
    }).then(() => {
      $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then((data) => {
        let users = data.data;
        for (let item of users) {
          if ($scope.logedAc === item.firstName + " " + item.lastName) {
            $scope.logedUser = item;
            console.log($scope.logedUser);
            console.log($scope.logedUser.orders);
            $scope.deleteConfirmShow(false,null);
          }
        }
      })
    })
  }
}])

app.controller('register-controller', ['$scope', '$http', '$routeParams', '$location', ($scope, $http, $routeParams, $location) => {
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
      let correctNames = true;
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
        }).then(() => {
          alert('account created');
        })
      }
    }

  }
}])

app.constant("moment", moment);



