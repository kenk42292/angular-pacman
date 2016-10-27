
pacmanApp.controller("gameController", function($scope) {
       
        $scope.gameState = {
            score : 0,
            numLives : 3
        };
        
        $scope.incrementScore = function() {
            $scope.gameState.score += 1;
        }

});


