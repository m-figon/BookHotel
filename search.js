
app.controller('search-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
    $scope.addConfirm = false;
    $scope.timeDifference = null;
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.tmpObj = null;
    $scope.addConfirmShow = (value, obj) => {
        $scope.tmpObj = obj;
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
            } if (item === $scope.$parent.checkIn.substr(0, 3)) {
                first = key;
            }
        }
        if (second === first) {
            $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
        } else if (second === first + 1) {
            $scope.timeDifference = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
            $scope.timeDifference += 30;
        }
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
                            $scope.addConfirmShow(false, null);

                            alert('you reserved!');
                        })
                    })
                }
            }
        })

    }

}])