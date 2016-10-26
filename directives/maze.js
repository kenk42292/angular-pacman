
pacmanApp.directive("maze", function() {
   
    function controller($scope) {
        var gridVisual = [
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,0,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],
            [2,1,2,2,2,2,2,2,1,1,2,1,1,2,2,2,1,1,1,2],
            [2,1,2,1,1,1,1,2,1,2,2,1,1,2,1,2,2,2,1,2],
            [2,1,2,2,2,2,1,1,1,2,2,2,2,2,1,2,2,2,1,2],
            [2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,2,2,2,1,2],
            [2,1,2,2,2,2,2,1,1,1,2,2,2,2,1,1,1,1,1,2],
            [2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,2,1,2,2,2,2,1,1,2,2,2,1,1,1,2,2,1,2],
            [2,1,2,1,2,2,2,2,1,1,2,2,2,2,2,1,2,2,1,2],
            [2,1,1,1,2,2,2,2,1,1,2,1,1,1,2,1,2,2,1,2],
            [2,1,1,1,1,1,1,1,1,1,2,1,1,1,2,1,2,2,1,2],
            [2,1,2,2,1,2,2,2,1,1,2,2,2,1,2,1,2,2,1,2],
            [2,1,2,2,1,2,1,2,1,2,2,1,2,1,2,1,2,2,1,2],
            [2,1,2,2,2,2,1,2,1,2,2,1,2,1,2,1,2,2,1,2],
            [2,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,2],
            [2,1,1,1,2,2,2,2,1,1,2,1,2,1,1,2,2,2,1,2],
            [2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,2,2,1,2],
            [2,2,2,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        ];

        $scope.GRID = {};
        for (var i=0; i<GRID_HEIGHT; i++) {
            for (var j=0; j<GRID_WIDTH; j++) {
                $scope.GRID[i*GRID_HEIGHT+j] = gridVisual[i][j];
            }
        }
        
        /** Track pacman (y, x) pixel-coordinates */
        $scope.initialPacmanLocation = [1*CELL_HEIGHT, 1*CELL_WIDTH];
        $scope.pacmanLocation = [1*CELL_HEIGHT, 1*CELL_WIDTH];
        
        /** Track ghost (y, x) pixel-coordinates */
        $scope.initialGhostLocations = {
            "blinky" : [1*CELL_HEIGHT, 11*CELL_WIDTH],
            "inky" : [1*CELL_HEIGHT, 11*CELL_WIDTH],
            "pinky" : [2*CELL_HEIGHT, 12*CELL_WIDTH],
            "clyde" : [2*CELL_HEIGHT, 12*CELL_WIDTH]
        }
        
        $scope.ghostLocations = {
            "blinky" : [1*CELL_HEIGHT, 11*CELL_WIDTH],
            "inky" : [1*CELL_HEIGHT, 11*CELL_WIDTH],
            "pinky" : [2*CELL_HEIGHT, 12*CELL_WIDTH],
            "clyde" : [2*CELL_HEIGHT, 12*CELL_WIDTH]
        }
        
        $scope.$on("pgOverlap", function(event, data) {
            console.log("overlap message received in maze");
            $scope.$broadcast("reset");
            $scope.gameState.numLives -= 1;
        });
   }


    return {
        restrict: "E",
        scope: false,
        replace: true,
        controller: controller,
        transclude: true,
        templateUrl: "templates/maze.html"
    }
})
        


