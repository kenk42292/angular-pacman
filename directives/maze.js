
pacmanApp.directive("maze", function() {
    
    var GRID_HEIGHT = 20;
    var GRID_WIDTH = 20;
   

    return {
        restrict: "E",
        scope: false,
        replace: true,
        transclude: true,
        templateUrl: "templates/maze.html"
    }
})
        


