
pacmanApp.controller("mainController", function($scope) {
        $scope.LEFT = 37;
        $scope.UP = 38;
        $scope.RIGHT = 39;
        $scope.DOWN = 40;

        $scope.maze = new Maze();



        function Maze() {
            $scope.GRID = [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,1],
                [1,0,0,0,0,1,1,1,0,0,1,1,1,0,1,0,1,1,0,1],
                [1,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,1,1,0,1],
                [1,0,1,1,1,1,0,1,0,0,0,0,1,0,1,0,1,1,0,1],
                [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
                [1,0,0,0,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            ];



            $scope.brickLocations = [];
            for (var i=0; i<20; i++) {
                for (var j=0; j<20; j++) {
                    if ($scope.GRID[i][j]==1) {
                        $scope.brickLocations.push([i, j]);
                    }
                }
            }
            $scope.pelletLocations = [];
            for (var i=0; i<20; i++) {
                for (var j=0; j<20; j++) {
                    if ($scope.GRID[i][j]==0) {
                        $scope.pelletLocations.push([i, j]);
                    }
                }
            }
        }
});


