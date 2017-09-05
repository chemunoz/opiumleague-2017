(function() {
  let app = angular.module('opiumLeage', []);

  let season = "2017-2018";

  //Generic comparison function
  cmp = function(x, y){
    return x > y ? 1 : x < y ? -1 : 0;
  };

  //Generic average function
  Math.average = function() {
    let cnt, tot, i;
    cnt = arguments.length;
    tot = i = 0;
    while (i < cnt) tot += arguments[i++];
    return tot / cnt;
  }

  //Generic comparison function
  sortArray = function(arr){

    return false
  };

  app.run(function($rootScope, $http){
    $rootScope.players = [];
    $http.get("../data/players.json").then(function (response) {
      console.log("Datos en bruto", response);
      $rootScope.players = response.data[season];
      $rootScope.$broadcast('playersLoaded');
    });
  });



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
      $scope.general_table.score_best = 0;
      $scope.general_table.score_worst = 1000;
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
        $scope.general_table.score_best < $scope.general_table[i].score_best ? $scope.general_table.score_best = $scope.general_table[i].points_jornadas : null;
        $scope.general_table.score_worst > $scope.general_table[i].score_worst ? $scope.general_table.score_worst = $scope.general_table[i].points_jornadas : null;
        console.log("peor: ", $scope.general_table.score_worst);
      }
      console.log('Clasificación General', $scope.general_table);
    });
  });



  //GALLERY CONTROLLER
  app.controller('GalleryController', function($scope, $rootScope){

    //Generate Gallery
    $scope.$on('playersLoaded', function(event){
      //Use angular.copy because "=" pass data by reference
      $scope.players_gallery = angular.copy($scope.players);

      //Sort
      $scope.players_gallery.sort(function(a, b){
        //note the minus before -cmp, for descending order
        return cmp(
          [cmp(a.name, b.name)],
          [cmp(b.name, a.name)]
        );
      });
    });
  });



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
