
pacmanApp.controller("gameController", function($scope) {
        $scope.LEFT = 37;
        $scope.UP = 38;
        $scope.RIGHT = 39;
        $scope.DOWN = 40;
        
        $scope.gameState = {
            score : 0,
            numLives : 3
        };
        
        $scope.incrementScore = function() {
            $scope.gameState.score += 1;
        }

});


