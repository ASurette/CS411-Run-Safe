
angular.module('RunSafe', [])
    .directive('nameDisplay', function() {
        return {
            scope: true,
            restrict: 'EA',
            template: "<b>This can be anything {{name}}</b>"}
    })
    .controller('RunSafectrl', function($scope, $http){

        //CREATE USER (POST)
        $scope.createUser = function() {
            if($scope.dbID) {$scope.updateUser($scope.dbID);}
            else {
            var request = {
                method: 'post',
                url: 'http://localhost:3000/api/db',
                data: {
                    username: $scope.firstname + " " + $scope.lastname,
                    city: $scope.city,
                    age: $scope.age,
                    height: $scope.height,
                    weight: $scope.weight,
                }
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.username = $scope.city = $scope.age = $scope.height = $scope.weight = '';
                    $scope.getUsers();
                })
            }
        }

        //CREATE FAVORITE ROUTE(POST)
        $scope.createRoute = function() {
            if($scope.dbID) {$scope.updateRoute($scope.dbID);}
            else {
                var request = {
                    method: 'post',
                    url: 'http://localhost:3000/api/db',
                    data: {
                        routename: $scope.routename,
                        startpoint: $scope.startpoint,
                        distance: $scope.distance,
                        link: $scope.link
                    }
                };
                $http(request)
                    .then(function(response){
                        $scope.inputForm.$setPristine();
                        $scope.routename = $scope.startpoint = $scope.distance = $scope.link = '';
                        $scope.getRoutes();
                    })
            }
        }

        //READ USER (GET)
        $scope.getUsers = function(_id) {
            $http.get('http://localhost:3000/api/db')
                .then(function(response){
                    $scope.users = response.data;
                })
        };


        //READ FAVORITES (GET)
        $scope.getRoutes = function() {
            $http.get('http://localhost:3000/api/db')
                .then(function(response){
                    $scope.routes = response.data;

                })
        };

        //UPDATE USER (PUT)
        $scope.setUserUpdate = function(user) {
            $scope.buttonMessage = "Update User";
            $scope.h2message="Updating ";
            $scope.username=user.firstname + " " + user.lastname;
            $scope.city = user.city;
            $scope.age = user.age;
            $scope.dbID = user._id;
            $scope.height=user.height;
            $scope.weight=user.weight;

        };
        $scope.updateUser = function (userID) {
            var request = {
                method: 'put',
                url: 'http://localhost:3000/api/db/' + userID ,
                data: {
                    username: $scope.firstname + " " + $scope.lastname,
                    city: $scope.city,
                    age: $scope.age,
                    height: $scope.height,
                    weight: $scope.weight,
                    _id: userID
                }
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.username = $scope.city = $scope.age = $scope.height = $scope.weight = '';
                    $scope.h2message="Add user";
                    $scope.buttonMessage = "Add User";
                    $scope.getUsers();
                    $scope.dbID = null;
                })

        };

        //UPDATE FAVORITE (PUT)
        $scope.setRouteUpdate = function(route) {
            $scope.buttonMessage = "Update Route";
            $scope.h2message="Updating ";
            $scope.routename=route.routename;
            $scope.startpoint=route.startpoint;
            $scope.distance=route.distance;
            $scope.link=user.link;

        };
        $scope.updateRoute = function (routeID) {
            var request = {
                method: 'put',
                url: 'http://localhost:3000/api/db/' + routeID ,
                data: {
                    routename: $scope.routename,
                    startpoint: $scope.startpoint,
                    distance: $scope.distance,
                    link: $scope.link,
                    _id: routeID
                }
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.routename = $scope.startpoint = $scope.distance = $scope.link = '';
                    $scope.h2message="Add route";
                    $scope.buttonMessage = "Add Route";
                    $scope.getRoutes();
                    $scope.dbID = null;
                })

        };

        //DELETE USER (DELETE)
        $scope.deleteUser = function (_id) {

            var request = {
                method: 'delete',
                url: 'http://localhost:3000/api/db/' + _id ,
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.username = $scope.city = $scope.age = $scope.height = $scope.weight = '';
                    $scope.getUsers();
                })

        };

        //DELETE ROUTE (DELETE)
        $scope.deleteRoute = function (_id) {

            var request = {
                method: 'delete',
                url: 'http://localhost:3000/api/db/' + _id ,
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.routename = $scope.startpoint = $scope.distance = $scope.link = '';
                    $scope.getRoutes();
                })

        };



      $scope.initApp = function () {
          $scope.buttonState = "create";
          $scope.h2message="Add user";
          $scope.buttonMessage = "Add User";
          $scope.getUsers();
      }

    })
    //This controller handles toggling the display of details in the user list
    .controller('listController', function ($scope){
        $scope.display = true;

    });
