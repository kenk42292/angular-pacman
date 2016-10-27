
pacmanApp.directive("maze", function() {
   
    function controller($scope) {

        $scope.GRID = generateMaze(GRID_HEIGHT, GRID_WIDTH, 1, 1);
        $scope.numPellets = 0;
        for (var k in $scope.GRID) {
            if ($scope.GRID[k]==1) {
                $scope.numPellets += 1;
            }
        }
        console.log($scope.numPellets);
        

        
        /** Track pacman (y, x) pixel-coordinates */
        $scope.initialPacmanLocation = [1*CELL_HEIGHT, 1*CELL_WIDTH];
        $scope.pacmanLocation = [1*CELL_HEIGHT, 1*CELL_WIDTH];
        
        /** Track ghost (y, x) pixel-coordinates */
        $scope.initialGhostLocations = {
            "blinky" : [(GRID_HEIGHT-2)*CELL_HEIGHT, (GRID_WIDTH-2)*CELL_WIDTH],
            "inky" : [(GRID_HEIGHT-2)*CELL_HEIGHT, (GRID_WIDTH-3)*CELL_WIDTH],
            "pinky" : [(GRID_HEIGHT-3)*CELL_HEIGHT, (GRID_WIDTH-2)*CELL_WIDTH],
            "clyde" : [(GRID_HEIGHT-3)*CELL_HEIGHT, (GRID_WIDTH-3)*CELL_WIDTH]
        }
        
        $scope.ghostLocations = {
            "blinky" : [(GRID_HEIGHT-2)*CELL_HEIGHT, (GRID_WIDTH-2)*CELL_WIDTH],
            "inky" : [(GRID_HEIGHT-2)*CELL_HEIGHT, (GRID_WIDTH-3)*CELL_WIDTH],
            "pinky" : [(GRID_HEIGHT-3)*CELL_HEIGHT, (GRID_WIDTH-2)*CELL_WIDTH],
            "clyde" : [(GRID_HEIGHT-3)*CELL_HEIGHT, (GRID_WIDTH-3)*CELL_WIDTH]
        }
        
        $scope.$on("pgOverlap", function(event, data) {
            console.log("overlap message received in maze");
            $scope.$broadcast("reset");
            $scope.decrementLives();
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
        


