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


    // COUNTDOWN
    // // Set the date we're counting down to
    // let countDownDate = new Date("Aug 17, 2018 20:15:00").getTime();
    //
    // // Update the count down every 1 second
    // let x = setInterval(function() {
    //   // Get todays date and time
    //   let now = new Date().getTime();
    //
    //   // Find the distance between now an the count down date
    //   let distance = countDownDate - now;
    //
    //   // Time calculations for days, hours, minutes and seconds
    //   let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //   let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //   let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //   let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    //
    //   // Output the result in an element with id="demo"
    //   document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
    //   + minutes + "m " + seconds + "s ";
    //
    //   // If the count down is over, write some text
    //   if (distance < 0) {
    //       clearInterval(x);
    //       document.getElementById("countdown").innerHTML = "EXPIRED";
    //   }
    // }, 1000);

  })

})();
