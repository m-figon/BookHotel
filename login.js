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