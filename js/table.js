(function() {
  let app = angular.module('opiumLeage');

  //TABLE CONTROLLER
  app.controller('TableController', function($scope, $rootScope){
    $scope.$on('playersLoaded', function(event){
      //Use angular.copy because "=" pass data by reference
      $scope.general_table = angular.copy($scope.players);

      //CLASIFICACION POR JORNADAS
      //Create Array of tables for each match-day
      let calculate_jornadas = {};
      for (let i = 0; i < $scope.general_table.length; i++) {
        $scope.general_table[i].score_total = 0;
        for (let j = 0; j < $scope.general_table[i].points_jornadas.length; j++) {
          //Calculate total points for General table
          $scope.general_table[i].score_total += $scope.general_table[i].points_jornadas[j];

          //Create each Match-day tables
          !calculate_jornadas[`jornada_${j+1}`] ? calculate_jornadas[`jornada_${j+1}`] = [] : null;
          calculate_jornadas[`jornada_${j+1}`].push({
            "team": $scope.general_table[i].team,
            "points": $scope.general_table[i].points_jornadas[j]
          });
        }
      }
      //Sort each Match-day tables by points
      let count_jornada = 0;
      for (jornada in calculate_jornadas){
        count_jornada += 1;
        calculate_jornadas[jornada].sort(function(a, b){
          //note the minus before -cmp, for descending order
          return cmp(
            [-cmp(a.points, b.points), cmp(a.team, b.team)],
            [-cmp(b.points, a.points), cmp(b.team, a.team)]
          );
        });
        calculate_jornadas[jornada].best_score = 0;
        calculate_jornadas[jornada].worst_score = 1000;
        calculate_jornadas[jornada].name = `JORNADA ${count_jornada}`;
        for (let i = 0; i < calculate_jornadas[jornada].length; i++){
          // calculate_jornadas[jornada][i].position = i + 1;
          if (i > 0){
            calculate_jornadas[jornada][i].points === calculate_jornadas[jornada][i-1].points ? calculate_jornadas[jornada][i].position = calculate_jornadas[jornada][i-1].position : calculate_jornadas[jornada][i].position = i + 1;
          }else{
            calculate_jornadas[jornada][i].position = i + 1;
          }
          calculate_jornadas[jornada].best_score < calculate_jornadas[jornada][i].points ? calculate_jornadas[jornada].best_score = calculate_jornadas[jornada][i].points : null;
          calculate_jornadas[jornada].worst_score > calculate_jornadas[jornada][i].points ? calculate_jornadas[jornada].worst_score = calculate_jornadas[jornada][i].points : null;
        }
      }
      console.log('Clasificación por Jornadas', calculate_jornadas);
      $scope.jornadas_table = calculate_jornadas;


      //CLASIFICACION GENERAL
      //Sort
      $scope.general_table.sort(function(a, b){
        //note the minus before -cmp, for descending order
        return cmp(
          [-cmp(a.score_total, b.score_total), cmp(a.team, b.team)],
          [-cmp(b.score_total, a.score_total), cmp(b.team, a.team)]
        );
      });

      //Calculate
      $scope.general_table.score_best = {
        name: "",
        score: 0,
        image: ""
      };
      $scope.general_table.score_worst = {
        name: "",
        score: 1000,
        image: ""
      };
      for (let i = 0; i < $scope.general_table.length; i++) {
        $scope.general_table[i].order = i + 1;
        if (i > 0){
          $scope.general_table[i].score_total === $scope.general_table[i-1].score_total ? $scope.general_table[i].position = $scope.general_table[i-1].position : $scope.general_table[i].position = i + 1;
        }else{
          $scope.general_table[i].position = i + 1;
        }
        //Best, Worst, Average and Number of jornadas for each player
        $scope.general_table[i].score_best = Math.max.apply(null, $scope.general_table[i].points_jornadas.filter(Boolean));
        $scope.general_table[i].score_worst = Math.min.apply(null, $scope.general_table[i].points_jornadas.filter(Boolean));
        $scope.general_table[i].score_average = Math.average.apply(null, $scope.general_table[i].points_jornadas.filter(Boolean));
        $scope.general_table[i].num_jornadas = $scope.general_table[i].points_jornadas.filter((value)=>{return value !== 0;}).length;

        //Best, Worst for the whole season
        //Best
        if ($scope.general_table.score_best.score < $scope.general_table[i].score_best){
          $scope.general_table.score_best.name = $scope.general_table[i].name;
          $scope.general_table.score_best.score = $scope.general_table[i].score_best;
          $scope.general_table.score_best.image = $scope.general_table[i].image;
        }
        //Worst
        if ($scope.general_table.score_worst.score > $scope.general_table[i].score_worst){
          $scope.general_table.score_worst.name = $scope.general_table[i].name;
          $scope.general_table.score_worst.score = $scope.general_table[i].score_worst;
          $scope.general_table.score_worst.image = $scope.general_table[i].image;
        }
      }
      console.log('Clasificación General', $scope.general_table);
    });
  });

})();
