angular.module('auth', [])

.controller('AuthController', function($scope, $window, AuthFactory) {
  $scope.user = {};
  $scope.login = function() {
    AuthFactory.login({
      username: $scope.username,
      password: $scope.password
    }, function(success) {
      if(success) {
        alert("You logged in!");
      } else {
        alert("Login failed");
      }
    });
  }

  $scope.signup = function() {
    AuthFactory.signup({
      username: $scope.username,
      password: $scope.password
    })
  }

  $scope.logout = function() {
    AuthFactory.logout();
  }
})

.factory('AuthFactory', function($http, $q) {
  var login = function(data, cb) {
    if((data.username || data.password) === (null || undefined))
      return $q(cb, false);
    return $http.post('/login', data)
      .then(function(data) {
        cb(data.success);
      })
  };

  var signup = function() {
    if((data.username || data.password) === (null || undefined))
      return $q(cb, false);
    return $http.post('/signup', data)
      .then(function(data) {
        cb(data.success);
      })
  };

  var logout = function() {
    $window.localStorage.token = null;
  };

  return {
    login: login,
    signup: signup,
    logout: logout
  }
})