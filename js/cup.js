(function() {
  let app = angular.module('opiumLeage');

  //GALLERY CONTROLLER
  app.controller('CupController', function($scope, $rootScope){

    //Generate Gallery
    $scope.$on('playersLoaded', function(event){
      //Use angular.copy because "=" pass data by reference
      $scope.players_cup = angular.copy($rootScope.players);

      // Sort by player name
      $scope.players_name = $scope.players_cup.sort(function(a, b){
        //note the minus before -cmp, for descending order
        return cmp(
          [cmp(a.name, b.name)],
          [cmp(b.name, a.name)]
        );
      });
    });
  });

})();
