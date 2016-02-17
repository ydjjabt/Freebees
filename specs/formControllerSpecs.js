"use strict";

describe('FormController', function(){
  var $scope, $rootScope, $http, createController, DBActions, Map;

  beforeEach(module('myApp'));

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    DBActions = $injector.get('DBActions');
    Map = $injector.get('Map');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function(){
      return $controller('FormController', {
        $scope: $scope,
        DBActions: DBActions,
        Map: Map
      });
    }
  }));

  it('should have a user property on the $scope', function(){
    
  })
})