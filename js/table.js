(function() {
  let app = angular.module('opiumLeage');

  //TABLE CONTROLLER
  app.controller('TableController', function($scope, $rootScope){
    $scope.$on('playersLoaded', function(event){

      // //Use angular.copy because "=" pass data by reference
      $scope.historic_general = angular.copy($scope.tables);
      $scope.historic_jornada = angular.copy($scope.tables);


      //CLASIFICACION ACTUAL (los datos YA vienen ordenados de app.js)
      $scope.general_table = angular.copy($scope.tables[`jornada_${Object.values($scope.tables).length - 3}`]);
      // console.log("ClasificacioN generaL", $scope.general_table);


      //CLASIFICACIONES GENERALES
      for (jornada in $scope.historic_general){
        if (typeof $scope.historic_general[jornada] === 'object' && Object.keys($scope.historic_general[jornada]).length > 5){
          $scope.historic_general[jornada].sort(function(a, b){
            //note the minus before -cmp, for descending order
            return cmp(
              [-cmp(a.score_general, b.score_general), cmp(a.team, b.team)],
              [-cmp(b.score_general, a.score_general), cmp(b.team, a.team)]
            );
          });
          $scope.historic_general[jornada].jor_name = `${jornada}`.replace("_", " ").toUpperCase();
        }
      }
      // console.log("Clasificaciones generales", $scope.historic_general);


      //CLASIFICACIONES JORNADAS
      for (jornada in $scope.historic_jornada){
        if (typeof $scope.historic_jornada[jornada] === 'object' && Object.keys($scope.historic_jornada[jornada]).length > 5){
          $scope.historic_jornada[jornada].sort(function(a, b){
            //note the minus before -cmp, for descending order
            return cmp(
              [-cmp(a.score_jornada, b.score_jornada), cmp(a.team, b.team)],
              [-cmp(b.score_jornada, a.score_jornada), cmp(b.team, a.team)]
            );
          });
          $scope.historic_jornada[jornada].jor_name = `${jornada}`.replace("_", " ").toUpperCase();
        }
      }
      // console.log("Clasificaciones jornada", $scope.historic_jornada);

    });
  });

})();
