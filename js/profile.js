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

      $scope.player = $scope.players_profile[url_parameters.id];
      console.log("Usuario elegido:", $scope.player);

      $scope.player.score_max = Math.max.apply(null, $scope.player.points.filter((value)=>{return value !== null;}));
      $scope.player.positions_general_differences = $scope.player.positions_general.map(function(value, index) {
        return (index === 0) ? 0 : $scope.player.positions_general[index-1] - value;
      } );
      $scope.player.positions_general_differences_max = Math.max.apply(null, $scope.player.positions_general_differences.filter((value)=>{return !isNaN(value);}));
      $scope.player.positions_general_differences_min = Math.abs(Math.min.apply(null, $scope.player.positions_general_differences.filter((value)=>{return !isNaN(value);})));

      let ejes = {
        XJornada: [],
        YJornada: [],
        YMedia: [],
        YPosicionesGeneral: [],
        YPosicionesJornada: []
      };

      for (let i = 0; i < $scope.player.points.filter((value)=>{return value !== null;}).length; i++) {
        // if ((i+1) >= $scope.player.points.filter((value)=>{return value !== null;}).length - 5){
          ejes.XJornada.push(`J${i+1}`);
          ejes.YJornada.push($scope.player.points[i]);
          ejes.YMedia.push($scope.tables[`jornada_${i+1}`].score_average);
          ejes.YPosicionesGeneral.push($scope.player.positions_general[i]);
          ejes.YPosicionesJornada.push($scope.player.positions_jornada[i]);
        // }
      }







      // CHARTS
      Highcharts.chart('points_chart', {
          chart: {
              zoomType: 'xy'
          },
          title: {
              text: 'PUNTOS'
          },
          subtitle: {
              text: 'Jornada vs Media'
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              dataLabels: {
                format: '{y}',
                enabled: true,
                color: '#294469',
                shadow: false,
                // align: 'right',
                // x: -25,
                // style: {"fontSize": "10px", "textShadow": "0px" }
              },
              pointPadding: 0.1,
              groupPadding: 0
           }
          },
          xAxis: [{
              categories: ejes.XJornada,
              crosshair: true,
              min: ejes.XJornada.length - 5,
              max: ejes.XJornada.length - 1,
              scrollbar: {
                enabled: true
              }
          }],
          yAxis: [
            { // Primary yAxis
              title: {
                  text: null, // 'Media',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              labels: {
                  format: '{value}  pts',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              }
            },
            { // Secondary yAxis
              title: {
                  text: null, // 'Jornada',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              labels: {
                  format: '{value} pts',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              opposite: true
            }
          ],
          tooltip: {
              shared: true
          },
          // legend: {
          //     layout: 'vertical',
          //     align: 'left',
          //     x: 120,
          //     verticalAlign: 'top',
          //     y: 100,
          //     floating: true,
          //     backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          // },
          series: [
            {
              name: 'Jornada',
              type: 'column',
              yAxis: 1,
              data: ejes.YJornada,
              tooltip: {
                  valueSuffix: ' pts'
              },
              pointWidth: 40
            },
            {
              name: 'Media',
              type: 'spline',
              data: ejes.YMedia,
              tooltip: {
                  valueSuffix: ' pts'
              }
          }]
      });




      Highcharts.chart('positions_chart', {
          chart: {
              zoomType: 'xy'
          },
          title: {
              text: 'POSICIONES'
          },
          subtitle: {
              text: 'Jornada vs General'
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              dataLabels: {
                format: '{y}',
                enabled: true,
                color: '#294469',
                shadow: false,
                // align: 'right',
                // x: -25,
                // style: {"fontSize": "10px", "textShadow": "0px" }
              },
              pointPadding: 0.1,
              groupPadding: 0
           }
          },
          xAxis: [{
              categories: ejes.XJornada,
              crosshair: true,
              min: ejes.XJornada.length - 5,
              max: ejes.XJornada.length - 1,
              scrollbar: {
                enabled: true
              }
          }],
          yAxis: [
            { // Primary yAxis
              title: {
                  text: null, // 'General',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              labels: {
                  format: '{value}',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              reversed: true,
              tickInterval: 1
            },
            { // Secondary yAxis
              title: {
                  text: null, // 'Jornada',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              labels: {
                  format: '{value}',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              opposite: true,
              reversed: true,
              tickInterval: 1
            }
          ],
          tooltip: {
              shared: true
          },
          // legend: {
          //     layout: 'vertical',
          //     align: 'left',
          //     x: 120,
          //     verticalAlign: 'top',
          //     y: 100,
          //     floating: true,
          //     backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          // },
          series: [{
              name: 'Jornada',
              type: 'spline',
              yAxis: 1,
              data: ejes.YPosicionesJornada,
              tooltip: {
                  valueSuffix: 'º puesto'
              }

          }, {
              name: 'General',
              type: 'spline',
              data: ejes.YPosicionesGeneral,
              tooltip: {
                  valueSuffix: 'º puesto'
              }
          }]
      });


    });
  });

})();
