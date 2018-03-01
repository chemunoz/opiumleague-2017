// http://fantasticaliga.freehostia.com/views/profile.html?season=2017-2018&id=0

(function() {
  let app = angular.module('opiumLeage');

  //PROFILE CONTROLLER
  app.controller('ProfileController', function($scope, $rootScope, $location){

    $scope.$on('playersLoaded', function(event){
      //Use angular.copy because "=" pass data by reference
      $scope.players_profile = angular.copy($scope.players);

      // Get URL parameters
      let url_parameters = [];
      let url = $location.absUrl().slice($location.absUrl().indexOf('?') + 1).split('&');;
      for (let i = 0; i < url.length; i++) {
        let hash = url[i].split('=');
        url_parameters[hash[0]] = hash[1];
      }
      // console.log(url_parameters);
      console.log("Usuario elegido:", $scope.players_profile[url_parameters.id]);



      // CHARTS
      let data_columns = [];
      let data_columns2 = [];
      data_columns.push(["Jornada", "Posición", { role: 'annotation' } ]);
      data_columns2.push(["Jornada", "Puntos", "Media"]);

      for (let i = 0; i < $scope.players_profile[url_parameters.id].points.filter((value)=>{return value !== null;}).length; i++) {
        data_columns.push([`J${i+1}`, $scope.players_profile[url_parameters.id].positions_general[i], $scope.players_profile[url_parameters.id].positions_general[i]]);
        data_columns2.push([`J${i+1}`, $scope.players_profile[url_parameters.id].points[i], $scope.tables[`jornada_${i+1}`].score_average]);
      }
      $scope.player = $scope.players_profile[url_parameters.id];

      // let data_columns = [[]];
      // data_columns[0].push([$scope.players_profile[url_parameters.id].team].concat($scope.players_profile[url_parameters.id].points.filter((value)=>{return value !== null;})));
      console.log("points", data_columns);

      // GRAFICO EVOLUCION
      // let chart = c3.generate({
      //   bindto: '#chart_profile',
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

      google.charts.load('current', {packages: ['corechart', 'line']});
      google.charts.setOnLoadCallback(()=>{
        let data = google.visualization.arrayToDataTable(
          data_columns
        );
        let data2 = google.visualization.arrayToDataTable(
          data_columns2
        );

        let options = {
          title: `Posiciones por Jornada`,
          // curveType: 'function',
          legend: { position: 'bottom' },
          pointSize: 5,
          vAxis:{
            direction: -1
          },
          animation:{
            startup: true,
            duration: 2000
          },
          height: 450
        };

        let options2 = {
          title: `Puntos por Jornada`,
          // curveType: 'function',
          legend: { position: 'bottom' },
          pointSize: 5,
          animation:{
            startup: true,
            duration: 2000
          },
          height: 450,
        };

        let chart = new google.visualization.LineChart(document.getElementById('positions_chart'));
        let chart2 = new google.visualization.LineChart(document.getElementById('points_chart'));

        // Draw
        chart.draw(data, options);
        chart2.draw(data2, options2);
      });



    });
  });

})();
