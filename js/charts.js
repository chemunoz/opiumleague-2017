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

      // Axis X legend
      let categorias = [];
      $scope.players_chart[0].positions_general.forEach((jornada,index)=>{
        categorias.push(`J${index+1}`);
      })

      let position_evolution = [];
      let score_evolution = [];

      let position_series = {
        leader: [],
        champions: [],
        uefa: [],
        intertoto: [],
        descenso: [],
        jornada_winner: []
      }

      $scope.players_chart.forEach((player)=>{
        // Jornadas LIDER
        if (player.positions_general.filter((position)=>{return position === 1}).length > 0){
          position_series.leader.push({
              name: `${player.team} (${player.positions_general.filter((position)=>{return position === 1}).length})`,
              y: player.positions_general.filter((position)=>{return position === 1}).length
          });
        }
        // Jornadas CHAMPIONS
        if (player.positions_general.filter((position)=>{return position <= 4}).length > 0){
          position_series.champions.push({
              name: `${player.team} (${player.positions_general.filter((position)=>{return position<=4}).length})`,
              y: player.positions_general.filter((position)=>{return position<=4}).length
          });
        }
        // Jornadas UEFA
        if (player.positions_general.filter((position)=>{return (position > 4 && position < 7)}).length > 0){
          position_series.uefa.push({
              name: `${player.team} (${player.positions_general.filter((position)=>{return (position > 4 && position < 7)}).length})`,
              y: player.positions_general.filter((position)=>{return (position > 4 && position < 7)}).length
          });
        }
        // Jornadas INTERTOTO
        if (player.positions_general.filter((position)=>{return position === 7}).length > 0){
          position_series.intertoto.push({
              name: `${player.team} (${player.positions_general.filter((position)=>{return position === 7}).length})`,
              y: player.positions_general.filter((position)=>{return position === 7}).length
          });
        }
        // Jornadas DESCENSO
        if (player.positions_general.filter((position)=>{return (position <= $scope.players_chart.length && position >= $scope.players_chart.length-3)}).length > 0){
          position_series.descenso.push({
              name: `${player.team} (${player.positions_general.filter((position)=>{return (position <= $scope.players_chart.length && position >= $scope.players_chart.length-3)}).length})`,
              y: player.positions_general.filter((position)=>{return (position <= $scope.players_chart.length && position >= $scope.players_chart.length-3)}).length
          });
        }

        //CHARTS of Evolutions
        position_evolution.push({
            name: player.team,
            data: player.positions_general
        });
        score_evolution.push({
            name: player.team,
            data: player.positions_jornada
        });


        // Jornadas GANADOR JORNADA
        if (player.positions_jornada.filter((position)=>{return position === 1}).length > 0){
          position_series.jornada_winner.push({
              name: `${player.team}`,
              data: [player.positions_jornada.filter((position)=>{return position === 1}).length],
              showInLegend: false,
              groupPadding: 0.1
          });
        }
      });


      // Sort series
      for (serie in position_series){
        if (serie === "jornada_winner"){
          position_series[serie].sort(function(a, b){
            //note the minus before -cmp, for descending order
            return cmp(
              [-cmp(a.data, b.data)],
              [-cmp(b.data, a.data)]
            );
          });
        }else{
          position_series[serie].sort(function(a, b){
            //note the minus before -cmp, for descending order
            return cmp(
              [-cmp(a.y, b.y)],
              [-cmp(b.y, a.y)]
            );
          });
        }
      }
      console.log("Position Series: ", position_series);
      console.log("Position Evolution: ", position_evolution);






      // GRAFICO 'GANADORES DE JORNADA'
      Highcharts.chart('chart_jornada_winner', {
        chart: {
          type: 'column'
          // marginLeft: 5,
          // marginRight: 5
        },
        title: {
          text: null // 'GANADORES DE JORNADA'
        },
        subtitle: {
          text: '(Número de Jornadas ganadas)'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: 'JORNADAS', //categorias,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: null // 'Jornadas'
          },
          minRange: 1,
          allowDecimals: false
        },
        tooltip: {
          headerFormat: "EQUIPO<br>",
          //'<span style="font-size:10px">{point.key}</span><table>',
          // pointFormat: `<tr>
          //                 <td style="color:{series.color};padding:0">{series.name}: </td>
          //                 <td style="padding:0"><b>{point.y} jornadas</b></td>
          //               </tr>`,
          // footerFormat: '</table>',
          // shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: position_series.jornada_winner
      });




      // GRAFICO 'JORNADAS COMO LÍDER'
      Highcharts.chart('chart_leader', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: null // 'JORNADAS COMO LÍDER'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>', //: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Porcentaje',
          colorByPoint: true,
          data: position_series.leader
        }]
      });



      // GRAFICO 'JORNADAS EN CHAMPIONS'
      Highcharts.chart('chart_champions', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: null // 'JORNADAS EN CHAMPIONS'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>', //: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Porcentaje',
          colorByPoint: true,
          data: position_series.champions
        }]
      });



      // GRAFICO 'JORNADAS EN UEFA'
      Highcharts.chart('chart_uefa', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: null // 'JORNADAS EN EUROPA LEAGUE'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>', //: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Porcentaje',
          colorByPoint: true,
          data: position_series.uefa
        }]
      });


      // GRAFICO 'JORNADAS EN INTERTOTO'
      Highcharts.chart('chart_intertoto', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: null // 'JORNADAS EN INTERTOTO'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>', //: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Porcentaje',
          colorByPoint: true,
          data: position_series.intertoto
        }]
      });



      // GRAFICO 'JORNADAS EN DESCENSO'
      Highcharts.chart('chart_descenso', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: null // 'JORNADAS EN DESCENSO'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>', //: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Porcentaje',
          colorByPoint: true,
          data: position_series.descenso
        }]
      });




      // GRAFICO 'EVOLUCION POSICION GENERAL'
      Highcharts.chart('chart_position_evolution', {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: null // 'EVOLUCIÓN DE POSICIONES EN LA GENERAL'
        },
        subtitle: {
          text: '(posiciones en la general en cada jornada)'
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
          categories: categorias,
          min: position_evolution[0].data.length - 5,
          max: position_evolution[0].data.length - 1,
          scrollbar: {
            enabled: true
          }
        }],
        yAxis: {
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
          },
          reversed: true
        },
        series: position_evolution
      });


      // GRAFICO 'EVOLUCION POSICIONES JORNADA'
      Highcharts.chart('chart_score_evolution', {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: null // 'EVOLUCIÓN DE POSICIONES EN LA JORNADA'
        },
        subtitle: {
          text: '(posiciones en cada jornada)'
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
        xAxis: {
          categories: categorias,
          min: score_evolution[0].data.length - 5,
          max: score_evolution[0].data.length - 1,
          scrollbar: {
            enabled: true
          }
        },
        yAxis: {
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
          },
          reversed: true
        },
        series: score_evolution
      });



    }); //playersLoaded
  });

})();
