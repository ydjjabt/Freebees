var app = angular.module('myApp', [])

.controller('FormController', function($scope, $http, Posts){
  $scope.user = {};
  $scope.sendPost = function(){     
    Posts.sendPost()
    .then(function(data){
      data = $scope.user
      console.log(data)
    })
    .catch(function(error){
      console.log(error)
    })
  }
})
.factory('Posts', function($http){
  var sendPost = function(){
  var config = {headers: {'Content-Type':'application/x-www-form-urlencoded'}}
  return $http.post('/', config).then(function(data){
    console.log(data)
  }, function(err){
    console.log(err)
  })
  };
  return {
    sendPost: sendPost
  }
})

// var data = $.param({
//   location: $scope.user.location,
//   item: $scope.user.item
// })