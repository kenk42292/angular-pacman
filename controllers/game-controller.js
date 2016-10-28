
pacmanApp.controller("gameController", function($scope) {
       
        $scope.gameState = {
            score : 0,
            numLives : 10
        };
        
        $scope.incrementScore = function() {
            $scope.gameState.score += 1;
            if ($scope.gameState.score == $scope.numPellets) {
                window.alert("You won! Please refresh the page to play another maze!");
                $scope.$broadcast("end-game");
            }
        }

        $scope.decrementLives = function() {
            $scope.gameState.numLives -=1;
            if ($scope.gameState.numLives <= 0) {
                window.alert("The ghosts have bested you... Please refresh the page to play another maze!")
                $scope.$broadcast("end-game");
            }
        }
});


