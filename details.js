app.controller('details-controller', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
    $scope.hotel;
    $scope.detailsLoaded = false;
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.opinion = "Enter Opinion";
    $scope.rating = "none";
    $scope.wrongOpinion = false;
    $scope.opinionNumbers = [];
    for (let i = 0; i < 21; i++) {
        $scope.opinionNumbers.push(i * 0.5);
    }
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
        $http.get('https://rocky-citadel-32862.herokuapp.com/BookHotel/hotels').then((data) => {
            let hotels = data.data;
            for (let item of hotels) {
                if (item.name === $routeParams.details) {
                    $scope.hotel = item;
                    $scope.detailsLoaded = true;
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

            } if (item === $scope.$parent.checkIn.substr(0, 3)) {
                first = key;
            }
        }
        if (second === first) {
            $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
        } else if (second === first + 1) {
            $scope.timeDifference2 = parseInt($scope.$parent.checkOut.substr(4, 2)) - parseInt($scope.$parent.checkIn.substr(4, 2))
            $scope.timeDifference2 += 30;
        }
    }
    $scope.addConfirmShow = (value) => {
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