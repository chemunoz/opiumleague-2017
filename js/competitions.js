(function() {
  let app = angular.module('opiumLeage');

  //CONTROLLER
  app.controller('CupController', function($scope, $rootScope){

    //Generate Gallery
    $scope.$on('playersLoaded', function(event){
      //Use angular.copy because "=" pass data by reference
      $scope.players_cup = angular.copy($rootScope.players);

      // Sort by player name
      $scope.players_name = $scope.players_cup.sort(function(a, b){
        //note the minus before -cmp, for descending order
        return cmp(
          [cmp(a.name, b.name)],
          [cmp(b.name, a.name)]
        );
      });
    });
  });

  // COUNTDOWN
  // Set the date we're counting down to
  let FOCup = [
    //SORTEO
    {
      deadline: new Date("Sep 28, 2018 22:30:00").getTime(),
      date: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      distance: 0,
      text: ''
    },
    //COMIENZO
    {
    deadline: new Date("Oct 05, 2018 21:00:00").getTime(),
    date: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    distance: 0,
    text: ''
  }
  ];

  let Champions = [
    //SORTEO
    {
      deadline: new Date("Dec 22, 2018 16:00:00").getTime(),
      date: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      distance: 0,
      text: ''
    },
    //COMIENZO
    {
      deadline: new Date("Jan 06, 2019 20:00:00").getTime(),
      date: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      distance: 0,
      text: ''
    }
  ];

  let EuropaLeague = {
    deadline: new Date("Feb 17, 2019 20:00:00").getTime(),
    date: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    distance: 0,
    text: ''
  };

  let Competitions = [FOCup[0], FOCup[1], Champions[0], Champions[1], EuropaLeague];

  // Update the count down every 1 second
  setInterval(function() {
    console.log("seconddd");
    // Get todays date and time
    let now = new Date().getTime();

    Competitions.forEach((competition)=>{
      // Find the distance between now an the count down date
      competition.distance = competition.deadline - now;
      // Time calculations for days, hours, minutes and seconds
      competition.date.days = Math.floor(competition.distance / (1000 * 60 * 60 * 24));
      competition.date.hours = Math.floor((competition.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      competition.date.minutes = Math.floor((competition.distance % (1000 * 60 * 60)) / (1000 * 60));
      competition.date.seconds = Math.floor((competition.distance % (1000 * 60)) / 1000);
      // If the count down is over, write some text
      if (competition.distance < 0) {
        clearInterval();
        competition.text = "COMENZADA!!";
      }else{
        competition.text = competition.date.days + "d " + competition.date.hours + "h " + competition.date.minutes + "m " + competition.date.seconds + "s ";
      }
    });

    // Output the result validating that the element exists
    document.getElementById("countdown-draw-FOCup") !== null ? document.getElementById("countdown-draw-FOCup").innerHTML = FOCup[0].text : null;
    document.getElementById("countdown-FOCup") !== null ? document.getElementById("countdown-FOCup").innerHTML = FOCup[1].text : null;
    document.getElementById("countdown-draw-Champions") !== null ? document.getElementById("countdown-draw-Champions").innerHTML = Champions[0].text : null;
    document.getElementById("countdown-Champions") !== null ? document.getElementById("countdown-Champions").innerHTML = Champions[1].text : null;
    document.getElementById("countdown-EuropaLeague") !== null ? document.getElementById("countdown-EuropaLeague").innerHTML = EuropaLeague.text : null;
  }, 1000);

})();
