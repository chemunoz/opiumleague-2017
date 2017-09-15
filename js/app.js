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
    return Math.round((tot / cnt) * 100) / 100;
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


})();
