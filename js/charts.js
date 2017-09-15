(function() {
  let app = angular.module('opiumLeage');

  //CHARTS CONTROLLER
  app.controller('ChartsController', function($scope, $rootScope){

    //Generate Chart
    $scope.$on('playersLoaded', function(event){
      //Use angular.copy because "=" pass data by reference
      $scope.players_chart = angular.copy($scope.players);
      //Sort
      $scope.players_chart.sort(function(a, b){
        //note the minus before -cmp, for descending order
        return cmp(
          [cmp(a.name, b.name)],
          [cmp(b.name, a.name)]
        );
      });

      let column_data = [];
      for (let i = 0; i < $scope.players_chart.length; i++){
        column_data.push([$scope.players_chart[i].name].concat($scope.players_chart[i].points_jornadas.filter((value)=>{return value !== 0;}).map((point, index)=>{
          let acum = 0;
          for (j=0; j<=index; j++){
            acum += $scope.players_chart[i].points_jornadas[j];
          }
          return acum
        })));
      }

      let chart = c3.generate({
        bindto: '#chart_jornada',
        data: {
          columns: column_data,
          labels: true
        },
        size: {
          width: 750,
          height: 500
        },
        padding: {
          top: 5,
          bottom: 5,
          right: 50,
          left: 50
        },
        axis: {
          x: {
            type: 'category',
            categories: ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20', 'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 'J29', 'J30', 'J31', 'J32', 'J33', 'J34', 'J35', 'J36', 'J37', 'J38']
          }
        }
      });

    });
  });

})();
