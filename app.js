let app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
  $routeProvider
    .when('/home', {
      templateUrl: "views/home.html"
    })
    .when('/search/:city', {
      templateUrl: "views/search.html"
    })
    .when('/search', {
      templateUrl: "views/search.html"
    })
    .otherwise({
      redirectTo: '/home'
    })
}])

app.controller('app-controller', ['$scope', '$http', ($scope, $http) => {
  $scope.calendarVisible = false;
  $scope.hotels=[];
  $scope.city="What is your destination?";
  $scope.found=true;
  $scope.writeFunc = () =>{
    console.log($scope.city);
  }
  $scope.focusFunc = (e) =>{
    if($scope.city==="What is your destination?"){
      $scope.city="";
    }
  }
  $scope.blurFunc = (e) =>{
    if($scope.city===""){
      $scope.city="What is your destination?";
    }
  }
  $scope.showCalendar = () => {
    $scope.calendarVisible = !$scope.calendarVisible;
  }
  $scope.searchFilter = () => {
    $scope.found=false;
    console.log($scope.city);
    for(let item of $scope.hotels){
      if(item.city===$scope.city){
        $scope.found=true;
      }
    }
  }
  $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
    $scope.hotels = data.data;
    console.log($scope.hotels);
  })
}])

app.controller('search-controller', ['$scope', '$http','$routeParams', ($scope, $http,$routeParams) => {
  $scope.cityFilter="";
  if($routeParams.city){
    $scope.cityFilter=$routeParams.city;
  }
  
}])

app.constant("moment", moment);

app.controller('calendar-controller', ['$scope', '$http', 'moment', ($scope, $http, moment) => {
  $scope.date1 = moment().format('ll');
  $scope.date2 = moment().add(1, 'months').format('ll');
  $scope.checkIn = "Check In";
  $scope.checkOut = "Check Out";
  $scope.year1 = $scope.date1.substr(8, 4);
  $scope.month1 = $scope.date1.substr(0, 3);
  $scope.month2 = $scope.date2.substr(0, 3);
  $scope.year2 = $scope.date2.substr(8, 4);
  let previousTarget1= null;
  let previousTarget2= null;
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
  $scope.chooseDay = (value,num,e) => {
    if(num===1){
      console.log($scope.month1+" "+value+", "+$scope.year1);
      $scope.checkIn=$scope.month1+" "+value+", "+$scope.year1;
      e.target.style.backgroundColor="#003580";
      e.target.style.color="white";
      if(previousTarget1){
        previousTarget1.style.backgroundColor='white';
        previousTarget1.style.color='black';
      }
      previousTarget1 = e.target;
    }else if(num===2){
      console.log($scope.month2+" "+value+", "+$scope.year2);
      $scope.checkOut=$scope.month2+" "+value+", "+$scope.year2;
      e.target.style.backgroundColor="#003580";
      e.target.style.color="white";
      if(previousTarget2){
        previousTarget2.style.backgroundColor='white';
        previousTarget2.style.color='black';
      }
      previousTarget2 = e.target;
    }
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
}])


