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