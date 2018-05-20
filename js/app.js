(function() {
  let app = angular.module('opiumLeage', []);
  let season = "2017-2018";

  // Comparison function
  cmp = (x, y)=>{
    return (x > y) ? 1 : (x < y) ? -1 : 0;
  };

  //Generic average function
  Math.average = function(){
    let arr = Array.from(arguments);
    let tot = arr.reduce((sum, score)=> {return sum += score})
    return Math.round((tot / arr.length) * 100) / 100;
  }

  //Generic sort function
  // sortArray = function(arr){
  //   return false
  // };

  app.run(function($rootScope, $http){
    $rootScope.players = [];
    $rootScope.tables = [];

    $http.get("../data/players.json").then((response)=>{
      // console.log("Raw data", response);

      $rootScope.players = angular.copy(response.data[season]);
      console.log("Players", $rootScope.players);

      //Calculate  PLAYERS DATA and unorderer jornadas
      let calculate_jornadas = {};
      $rootScope.players.forEach((player)=>{
        //Initialize
        player.score_general = 0;
        player.score_jornada = [];
        player.positions_jornada = [];
        player.positions_general = [];

        //Create each jornada Object
        player.points.filter((value)=>{return value !== null;}).forEach((score, index)=>{
          player.score_general += score || 0;
          player.score_jornada.push(player.score_general);

          !calculate_jornadas[`jornada_${index+1}`] ? calculate_jornadas[`jornada_${index+1}`] = [] : null;
          calculate_jornadas[`jornada_${index+1}`].push({
            id: player.id,
            team: player.team,
            shield: player.shield,
            name: player.name,
            image: player.image,
            score_jornada: score,
            score_general: player.score_general
          });
        })
      })



      //SORT (by score) and calculate for TABLES (jornada and general) and other KPIs
      let count_jornada = 0;
      let last_jornada = Object.keys(calculate_jornadas).length || 0;;
      let penultima = [];
      let ultima = [];
      let season_points_average = [];


      for (jornada in calculate_jornadas){
        count_jornada += 1;

        //JORNADA-TABLE POSITIONS: SORT BY SCORE and then BY TEAM NAME
        calculate_jornadas[jornada].sort(function(a, b){
          //note the minus before -cmp, for descending order
          return cmp(
            [-cmp(a.score_jornada, b.score_jornada), cmp(a.team, b.team)],
            [-cmp(b.score_jornada, a.score_jornada), cmp(b.team, a.team)]
          );
        });


        //Create new properties by JORNADA for calculate after
        calculate_jornadas[jornada].score_best = {
          name: '',
          team: '',
          score: 0
        };
        calculate_jornadas[jornada].score_worst = {
          name: '',
          team: '',
          score: 1000
        };
        calculate_jornadas[jornada].score_average = 0;
        calculate_jornadas[jornada].name = `JORNADA ${count_jornada}`;


        let points_average = [];
        calculate_jornadas[jornada].forEach((team, index)=>{
          // Calculate position number (and if there are more than one team sharing each position)
          if (index > 0){
            team.score_jornada === calculate_jornadas[jornada][index-1].score_jornada ? team.position_jornada = calculate_jornadas[jornada][index-1].position_jornada : team.position_jornada = index + 1;
          }else{
            team.position_jornada = index + 1;
          }

          // CALCULATE BEST, WORST and AVERAGE for each JORNADA
          if (calculate_jornadas[jornada].score_best.score < team.score_jornada){
            calculate_jornadas[jornada].score_best.name = team.name;
            calculate_jornadas[jornada].score_best.team = team.team;
            calculate_jornadas[jornada].score_best.image = team.image;
            calculate_jornadas[jornada].score_best.shield = team.shield;
            calculate_jornadas[jornada].score_best.score = team.score_jornada;
          }
          if (calculate_jornadas[jornada].score_worst.score > team.score_jornada){
            calculate_jornadas[jornada].score_worst.name = team.name;
            calculate_jornadas[jornada].score_worst.team = team.team;
            calculate_jornadas[jornada].score_worst.image = team.image;
            calculate_jornadas[jornada].score_worst.shield = team.shield;
            calculate_jornadas[jornada].score_worst.score = team.score_jornada;
          }
          points_average.push(team.score_jornada);

          let player = $.grep($rootScope.players, function(e){ return e.id == team.id });
          player[0].positions_jornada.push(team.position_jornada);

          team.score_best = Math.max.apply(null, player[0].points.filter((value)=>{return value !== null;}));
          team.score_worst = Math.min.apply(null, player[0].points.filter((value)=>{return value !== null;}));
          team.score_average = Math.average.apply(null, player[0].points.filter((value)=>{return value !== null;}));
          team.num_jornadas = player[0].points.filter((value)=>{return value !== null;}).length;
        })
        calculate_jornadas[jornada].score_average = Math.average.apply(null, points_average);


        // GENERAL-TABLE POSITIONS: SORT BY SCORE and subtraction between BEST-SCORE and WORST-SCORE in the season
        calculate_jornadas[jornada].sort(function(a, b){
          //note the minus before -cmp, for descending order
          return cmp(
            [-cmp(a.score_general, b.score_general), -cmp(a.score_best-a.score_worst, b.score_best-b.score_worst)],
            [-cmp(b.score_general, a.score_general), -cmp(b.score_best-b.score_worst, a.score_best-a.score_worst)]
          );
        });

        calculate_jornadas[jornada].forEach((team, index)=>{
          // Calculate POSITIONS GENERAL
          if (index > 0){
            team.score_general === calculate_jornadas[jornada][index-1].score_general ? team.position_general = calculate_jornadas[jornada][index-1].position_general : team.position_general = index + 1;
          }else{
            team.position_general = index + 1;
          }

          let player = $.grep($rootScope.players, function(e){ return e.id == team.id });
          player[0].positions_general.push(team.position_general);


          //Position Arrows
          if ((count_jornada + 1) === last_jornada){
            penultima[index] = {
              id: team.id,
              team: team.team,
              position: team.position_general
            }
          }
          if (count_jornada === last_jornada && last_jornada > 1){
            let player2 = $.grep(penultima, function(e){return e.id == team.id;});

            if(player2[0].position > team.position_general){
              // console.log(`${player2[0].team} GANÓ = (ANTES: ${player2[0].position} > AHORA: ${team.position_general}`);
              team.updown = '../img/arrow_up.png';
            }
            if(player2[0].position < team.position_general){
              // console.log(`${player2[0].team} PERDIÓ = (ANTES: ${player2[0].position} > AHORA: ${team.position_general}`);
              team.updown = '../img/arrow_down.png';
            }
            if(player2[0].position === team.position_general){
              // console.log(`${player2[0].team} IGUALÓ = (ANTES: ${player2[0].position} > AHORA: ${team.position_general}`);
              team.updown = '../img/arrow_equal.png';
            }
            team.updown_num = Math.abs(player2[0].position - team.position_general);
          }else{
            //When there only 1 jornada there is not "penultima"
            team.updown = '../img/arrow_equal.png';
            team.updown_num = 0;
          }

        });

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
      $rootScope.players.forEach((player, index)=>{
        player.winner_jornada = player.positions_jornada.filter((value)=>{return value === 1;}).length;
        player.top_clasificacion = player.positions_general.filter((value)=>{return value === 1;}).length;
      });





      $rootScope.$broadcast('playersLoaded');
    });
  });

})();
