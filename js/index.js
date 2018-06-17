(function() {
  let app = angular.module('opiumLeage');

  //GALLERY CONTROLLER
  app.controller('IndexController', function($scope, $rootScope){//, opiumLeageFactory){

    //Generate Gallery
    $scope.$on('playersLoaded', function(event){
      //Use angular.copy because "=" pass data by reference
      $scope.players_index = angular.copy($rootScope.players);

      // Sort by player name
      $scope.players_shields = $scope.players_index.sort(function(a, b){
        //note the minus before -cmp, for descending order
        return cmp(
          [cmp(a.team, b.team)],
          [cmp(b.team, a.team)]
        );
      });
    });

    //   // let hola = opiumLeageFactory.getData();
    //   // console.log(hola.$$state);
    //   opiumLeageFactory.getData().then(function(data){
    //     console.log("Scrapeerr??", data);
    //   })
    // });
    //
    // app.factory('opiumLeageFactory', function($http){
    //   return {
    //     getData: function(){
    //       return $http({
    //         // url: 'http://www.futmondo.com/match?match=597254e766c892590f1c90c6',
    //         // url: 'http://www.futmondo.com/espana/ranking?championship=57a8f641fb4cfa7e18e85647&userteam=57ae64da51eb01b94fbdf725',
    //         // url: 'http://www.futbolfantasy.com/puntos/2018/18/futmondo-prensa',
    //         // url: 'https://www.jornadaperfecta.com/puntos/',
    //         // url: 'https://www.ganarcomunio.com/ver_puntos.php?modo=prensa',
    //         // url: 'http://www.resultados-futbol.com/primera',
    //         // url: 'http://fantasticaliga.freehostia.com/views/table.html',
    //         url: 'http://valcan.freehostia.com/',
    //         method: 'GET'
    //       });
    //     }
    //   }


    // COUNTDOWN
    // Set the date we're counting down to
    let countDownDate = new Date("Aug 18, 2018 12:00:00").getTime();

    // Update the count down every 1 second
    let x = setInterval(function() {
      // Get todays date and time
      let now = new Date().getTime();

      // Find the distance between now an the count down date
      let distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

      // If the count down is over, write some text
      if (distance < 0) {
          clearInterval(x);
          document.getElementById("countdown").innerHTML = "EXPIRED";
      }
    }, 1000);

  })

})();
