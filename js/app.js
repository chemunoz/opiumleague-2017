(function() {
  let app = angular.module('opiumLeage', []);
  let season = "2017-2018";

  //Generic comparison function
  cmp = (x, y)=>{
    return (x > y) ? 1 : (x < y) ? -1 : 0;
  };

  //Generic average function
  Math.average = function(){
    let cnt, tot, i;
    cnt = arguments.length;
    tot = i = 0;
    while (i < cnt) tot += arguments[i++];
    return Math.round((tot / cnt) * 100) / 100;
  }

  //Generic sort function
  // sortArray = function(arr){
  //   return false
  // };

  app.run(function($rootScope, $http){
    $rootScope.players = [];
    $rootScope.tables = [];

    $http.get("../data/players.json").then((response)=>{
      console.log("Datos en bruto", response);

      $rootScope.players = angular.copy(response.data[season]);
      console.log("Players", $rootScope.players);

      let calculate_jornadas = {};
      for (let i = 0; i < $rootScope.players.length; i++) {
        $rootScope.players[i].score_general = 0;
        $rootScope.players[i].score_jornada = [];
        $rootScope.players[i].positions_jornada = [];
        $rootScope.players[i].positions_general = [];

        for (let j = 0; j < $rootScope.players[i].points.filter((value)=>{return value !== null;}).length; j++) {
          $rootScope.players[i].score_general += $rootScope.players[i].points[j] || 0;
          $rootScope.players[i].score_jornada.push($rootScope.players[i].score_general);

          //Create each Match-day tables

          !calculate_jornadas[`jornada_${j+1}`] ? calculate_jornadas[`jornada_${j+1}`] = [] : null;
          !calculate_jornadas[`jornada_${j+1}`] ? calculate_jornadas[`jornada_${j+1}`] = [] : null;
          calculate_jornadas[`jornada_${j+1}`].push({
            "id": $rootScope.players[i].id,
            "team": $rootScope.players[i].team,
            "shield": $rootScope.players[i].shield,
            "name": $rootScope.players[i].name,
            "image": $rootScope.players[i].image,
            "score_jornada": $rootScope.players[i].points[j],
            "score_general": $rootScope.players[i].score_jornada[j]
          });
        }
      }

      //Sort for Calculate Positions (jornada and general)
      let count_jornada = 0;
      let last_jornada = 0;
      let penultima = [];
      let ultima = [];
      let season_points_average = [];

      for (jornada in calculate_jornadas){
        (count_jornada === 0) ? last_jornada = Object.keys(calculate_jornadas).length : null;
        count_jornada += 1;

        // SORT AND CALCULATE BY JORNADA
        calculate_jornadas[jornada].sort(function(a, b){
          //note the minus before -cmp, for descending order
          return cmp(
            [-cmp(a.score_jornada, b.score_jornada), cmp(a.team, b.team)],
            [-cmp(b.score_jornada, a.score_jornada), cmp(b.team, a.team)]
          );
        });

        //Calculate for JORNADA
        calculate_jornadas[jornada].score_best = {
          name: "",
          team: "",
          score: 0
        };
        calculate_jornadas[jornada].score_worst = {
          name: "",
          team: "",
          score: 1000
        };
        calculate_jornadas[jornada].score_average = 0;
        calculate_jornadas[jornada].name = `JORNADA ${count_jornada}`;


        let points_average = [];
        for (let i = 0; i < calculate_jornadas[jornada].length; i++){
          // CALCULATE JORNADA POSITIONS
          if (i > 0){
            calculate_jornadas[jornada][i].score_jornada === calculate_jornadas[jornada][i-1].score_jornada ? calculate_jornadas[jornada][i].position_jornada = calculate_jornadas[jornada][i-1].position_jornada : calculate_jornadas[jornada][i].position_jornada = i + 1;
          }else{
            calculate_jornadas[jornada][i].position_jornada = i + 1;
          }

          // CALCULATE BEST, WORST and AVERAGE for each JORNADA
          if (calculate_jornadas[jornada].score_best.score < calculate_jornadas[jornada][i].score_jornada){
            calculate_jornadas[jornada].score_best.name = calculate_jornadas[jornada][i].name;
            calculate_jornadas[jornada].score_best.team = calculate_jornadas[jornada][i].team;
            calculate_jornadas[jornada].score_best.image = calculate_jornadas[jornada][i].image;
            calculate_jornadas[jornada].score_best.shield = calculate_jornadas[jornada][i].shield;
            calculate_jornadas[jornada].score_best.score = calculate_jornadas[jornada][i].score_jornada;
          }
          if (calculate_jornadas[jornada].score_worst.score > calculate_jornadas[jornada][i].score_jornada){
            calculate_jornadas[jornada].score_worst.name = calculate_jornadas[jornada][i].name;
            calculate_jornadas[jornada].score_worst.team = calculate_jornadas[jornada][i].team;
            calculate_jornadas[jornada].score_worst.image = calculate_jornadas[jornada][i].image;
            calculate_jornadas[jornada].score_worst.shield = calculate_jornadas[jornada][i].shield;
            calculate_jornadas[jornada].score_worst.score = calculate_jornadas[jornada][i].score_jornada;
          }
          points_average.push(calculate_jornadas[jornada][i].score_jornada);

          let player = $.grep($rootScope.players, function(e){ return e.id == calculate_jornadas[jornada][i].id });
          player[0].positions_jornada.push(calculate_jornadas[jornada][i].position_jornada);

          calculate_jornadas[jornada][i].score_best = Math.max.apply(null, player[0].points.filter((value)=>{return value !== null;}));
          calculate_jornadas[jornada][i].score_worst = Math.min.apply(null, player[0].points.filter((value)=>{return value !== null;}));
          calculate_jornadas[jornada][i].score_average = Math.average.apply(null, player[0].points.filter((value)=>{return value !== null;}));
          calculate_jornadas[jornada][i].num_jornadas = player[0].points.filter((value)=>{return value !== null;}).length;
        }
        calculate_jornadas[jornada].score_average = Math.average.apply(null, points_average);


        // CALCULATE  GENERAL POSITIONS
        calculate_jornadas[jornada].sort(function(a, b){
          //note the minus before -cmp, for descending order
          return cmp(
            [-cmp(a.score_general, b.score_general), cmp(a.team, b.team)],
            [-cmp(b.score_general, a.score_general), cmp(b.team, a.team)]
          );
        });


        for (let i = 0; i < calculate_jornadas[jornada].length; i++){
          // Calculate POSITIONS GENERAL
          if (i > 0){
            calculate_jornadas[jornada][i].score_general === calculate_jornadas[jornada][i-1].score_general ? calculate_jornadas[jornada][i].position_general = calculate_jornadas[jornada][i-1].position_general : calculate_jornadas[jornada][i].position_general = i + 1;
          }else{
            calculate_jornadas[jornada][i].position_general = i + 1;
          }

          let player = $.grep($rootScope.players, function(e){ return e.id == calculate_jornadas[jornada][i].id });
          player[0].positions_general.push(calculate_jornadas[jornada][i].position_general);

          if ((count_jornada + 1) === last_jornada){
              penultima[i] = {
                id: calculate_jornadas[jornada][i].id,
                team: calculate_jornadas[jornada][i].team,
                position: calculate_jornadas[jornada][i].position_general
              }
          }
          if (count_jornada === last_jornada){
              let player2 = $.grep(penultima, function(e){return e.id == calculate_jornadas[jornada][i].id;});

              if(player2[0].position > calculate_jornadas[jornada][i].position_general){
                // console.log(`${player2[0].team} GANÓ = (ANTES: ${player2[0].position} > AHORA: ${calculate_jornadas[jornada][i].position_general}`);
                calculate_jornadas[jornada][i].updown = '../img/arrow_up.png';
              }
              if(player2[0].position < calculate_jornadas[jornada][i].position_general){
                // console.log(`${player2[0].team} PERDIÓ = (ANTES: ${player2[0].position} > AHORA: ${calculate_jornadas[jornada][i].position_general}`);
                calculate_jornadas[jornada][i].updown = '../img/arrow_down.png';
              }
              if(player2[0].position === calculate_jornadas[jornada][i].position_general){
                // console.log(`${player2[0].team} IGUALÓ = (ANTES: ${player2[0].position} > AHORA: ${calculate_jornadas[jornada][i].position_general}`);
                calculate_jornadas[jornada][i].updown = '../img/arrow_equal.png';
              }
              calculate_jornadas[jornada][i].updown_num = Math.abs(player2[0].position - calculate_jornadas[jornada][i].position_general);
          }
        }

        // CALCULATE BEST, WORST and AVERAGE for whole SEASON
        !calculate_jornadas.score_best ? calculate_jornadas.score_best = {name: "", team: "", score: 0} : null;
        !calculate_jornadas.score_worst ? calculate_jornadas.score_worst = {name: "", team: "", score: 1000} : null;
        !calculate_jornadas.score_average ? calculate_jornadas.score_average = 0 : null;
        if(calculate_jornadas.score_best.score < calculate_jornadas[jornada].score_best.score){
          calculate_jornadas.score_best.name = calculate_jornadas[jornada].score_best.name;
          calculate_jornadas.score_best.team = calculate_jornadas[jornada].score_best.team;
          calculate_jornadas.score_best.image = calculate_jornadas[jornada].score_best.image;
          calculate_jornadas.score_best.shield = calculate_jornadas[jornada].score_best.shield;
          calculate_jornadas.score_best.score = calculate_jornadas[jornada].score_best.score;
        }
        if(calculate_jornadas.score_worst.score > calculate_jornadas[jornada].score_worst.score){
          calculate_jornadas.score_worst.name = calculate_jornadas[jornada].score_worst.name;
          calculate_jornadas.score_worst.team = calculate_jornadas[jornada].score_worst.team;
          calculate_jornadas.score_worst.image = calculate_jornadas[jornada].score_worst.image;
          calculate_jornadas.score_worst.shield = calculate_jornadas[jornada].score_worst.shield;
          calculate_jornadas.score_worst.score = calculate_jornadas[jornada].score_worst.score;
        }
        season_points_average.push(calculate_jornadas[jornada].score_average);
        calculate_jornadas.score_average = Math.average.apply(null, season_points_average);

      }


      $rootScope.tables = calculate_jornadas;
      console.log('Clasificaciones', $rootScope.tables);


      // Calculate Champions for each Jornada and league's lider
      for (let i = 0; i < $rootScope.players.length; i++) {
        $rootScope.players[i].winner_jornada = $rootScope.players[i].positions_jornada.filter((value)=>{return value === 1;}).length;
        $rootScope.players[i].top_clasificacion = $rootScope.players[i].positions_general.filter((value)=>{return value === 1;}).length;
      }





      $rootScope.$broadcast('playersLoaded');
    });
  });
  
})();
