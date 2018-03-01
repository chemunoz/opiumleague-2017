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

      // EVOLUCION POSICIONES
      let data_columns = [];
      let data_columns2 = [];
      let data_columns3 = [];
      let data_columns4 = [];
      for (let i = 0; i < $scope.players_chart.length; i++){
        if (i === 0){
          data_columns[0] = ["Jornada"];
          data_columns2[0] = ["Jornada"];
          // data_columns3[0] = ["Jugador", "Jornada"];
          data_columns4[0] = ["Jugador", "Jornada"];
        }
        data_columns[0].push($scope.players_chart[i].team)
        data_columns2[0].push($scope.players_chart[i].team)
        for (let j = 0; j < $scope.players_chart[i].positions_general.length; j++){
          (!data_columns[j+1]) ? data_columns[j+1] = [`J${j+1}`] : null;
          data_columns[j+1].push($scope.players_chart[i].positions_general[j])
        }
        for (let k = 0; k < $scope.players_chart[i].score_jornada.length; k++){
          (!data_columns2[k+1]) ? data_columns2[k+1] = [`J${k+1}`] : null;
          data_columns2[k+1].push($scope.players_chart[i].score_jornada[k])
        }

        ($scope.players_chart[i].winner_jornada !== 0) ? data_columns3.push([$scope.players_chart[i].team].concat($scope.players_chart[i].winner_jornada)) : null;
        ($scope.players_chart[i].top_clasificacion !== 0) ? data_columns4.push([$scope.players_chart[i].team].concat($scope.players_chart[i].top_clasificacion)) : null;
      }
      console.log("Grafico 1:", data_columns);
      console.log("Grafico 2:", data_columns2);
      console.log("Grafico 3:", data_columns3);
      console.log("Grafico 4:", data_columns4);

      google.charts.load('current', {packages: ['corechart', 'line']});
      google.charts.setOnLoadCallback(()=>{
        let data = google.visualization.arrayToDataTable(
          data_columns
        );
        let data2 = google.visualization.arrayToDataTable(
          data_columns2
        );
        let data4 = google.visualization.arrayToDataTable(
          data_columns4
        );

        let options = {
          title: `POSICIONES POR JORNADA`,
          // curveType: 'function',
          legend: {
            position: 'top',
            maxLines: 3 // No responde a números más altos
          },
          pointSize: 5,
          vAxis:{
            direction: -1
          },
          animation:{
            startup: true,
            duration: 1000
          },
          height: 600
        };

        let options2 = {
          title: `PUNTOS POR JORNADA`,
          // curveType: 'function',
          legend: {
            position: 'top',
            maxLines: 3 // No responde a números más altos
          },
          pointSize: 5,
          animation:{
            startup: true,
            duration: 1000
          },
          height: 600,
        };

        let options4 = {
          title: 'JORNADAS COMO LÍDER',
          is3D: true,
          // pieSliceText: 'label',
          height: 600,
          width: 900
        };

        let chart = new google.visualization.LineChart(document.getElementById('chart_position'));
        let chart2 = new google.visualization.LineChart(document.getElementById('chart_evolution'));
        let chart4 = new google.visualization.PieChart(document.getElementById('chart_top'));

        // Draw
        chart.draw(data, options);
        chart2.draw(data2, options2);
        chart4.draw(data4, options4);
      });


      // let data_columns = [
      //   [],[],[]
      // ];
      // for (let i = 0; i < $scope.players_chart.length; i++){
      //   data_columns[0].push([$scope.players_chart[i].name].concat($scope.players_chart[i].points_jornadas.filter((value)=>{return value !== 0;}).map((point, index)=>{
      //     let acum = 0;
      //     for (j=0; j<=index; j++){
      //       acum += $scope.players_chart[i].points_jornadas[j];
      //     }
      //     return acum
      //   })));
      //
      //   ($scope.players_chart[i].winner_jornada !== 0) ? data_columns[1].push([$scope.players_chart[i].name].concat($scope.players_chart[i].winner_jornada)) : null;
      //
      //   ($scope.players_chart[i].top_clasificacion !== 0) ? data_columns[2].push([$scope.players_chart[i].name].concat($scope.players_chart[i].top_clasificacion)) : null;
      // }
      // console.log("Data (chart 1): ", data_columns[0]);
      // console.log("Data (chart 2): ", data_columns[1]);
      // console.log("Data (chart 3): ", data_columns[2]);
      //
      // data_columns[1].sort(function(a, b){
      //   //note the minus before -cmp, for descending order
      //   return cmp(
      //     [-cmp(a["1"], b["1"])],
      //     [-cmp(b["1"], a["1"])]
      //   );
      // });
      //
      // // GRAFICO EVOLUCION
      // let chart = c3.generate({
      //   bindto: '#chart_evolution',
      //   data: {
      //     columns: data_columns[0],
      //     labels: true
      //   },
      //   size: {
      //     height: 500
      //   },
      //   padding: {
      //     top: 5,
      //     bottom: 5,
      //     right: 50,
      //     left: 50
      //   },
      //   axis: {
      //     x: {
      //       type: 'category',
      //       categories: ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20', 'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 'J29', 'J30', 'J31', 'J32', 'J33', 'J34', 'J35', 'J36', 'J37', 'J38']
      //     }
      //   }
      // });


      // GRAFICO GANADORES JORNADA
      data_columns3.sort(function(a, b){
        //note the minus before -cmp, for descending order
        return cmp(
          [-cmp(a["1"], b["1"])],
          [-cmp(b["1"], a["1"])]
        );
      });

      let chart2 = c3.generate({
        bindto: '#chart_winners',
        data: {
          columns: data_columns3,
          type : 'bar',
          labels: true
        },
        axis: {
          x: {
            type: 'category',
            categories: ['Players']
          }
        },
        bar: {
          space: 0.5,
          width: {
            ratio: 0.7 // this makes bar width 50% of length between ticks
          }
          // or
          //width: 100 // this makes bar width 100px
        },
        transition: {
          duration: 1000
        }
      });


      // GRAFICO JORNADAS LIDER
      // var chart3 = c3.generate({
      //   bindto: '#chart_top',
      //   data: {
      //     columns: data_columns4,
      //     type: 'pie',
      //     labels: true
      //   },
      //   pie: {
      //     title: "Winner por Jornada",
      //     label: {
      //       format: function(value, ratio, id) {
      //         return `${id} (${value})`;
      //       }
      //     }
      //   },
      //   size: {
      //     height: 400
      //   }
      // });


    }); //playersLoaded
  });

})();
