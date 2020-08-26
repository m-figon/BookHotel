app.controller('orders-controller', ['$scope', '$http', '$routeParams', '$location', ($scope, $http, $routeParams, $location) => {
    $scope.logedUser = null;
    $scope.deleteConfirm=false;
    $scope.tmpId=null;
    $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/users').then((data) => {
      let users = data.data;
      for (let item of users) {
        if ($scope.$parent.logedAc === item.firstName + " " + item.lastName) {
          $scope.logedUser = item;
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
            if ($scope.$parent.logedAc === item.firstName + " " + item.lastName) {
              $scope.logedUser = item;
              $scope.deleteConfirmShow(false,null);
            }
          }
        })
      })
    }
  }])