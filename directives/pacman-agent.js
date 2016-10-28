
pacmanApp.directive("pacmanAgent", function($document, $interval) {

    function link(scope, element, attrs) {
        
        /* INITIALIZATION */
        scope.y = scope.pacmanLocation[0];
        scope.x = scope.pacmanLocation[1];
    
        scope.mouthState = 0;
        scope.intendedDirection = RIGHT;
        scope.direction = RIGHT;

        /* USER CONTROL  */
        $document.on("keydown", function(event) {
            event.preventDefault();
            scope.intendedDirection = event.keyCode;
        });

        scope.$on("reset", function(event, mass) {
            scope.y = scope.initialPacmanLocation[0];
            scope.x = scope.initialPacmanLocation[1];
            scope.pacmanLocation[0] = scope.y;
            scope.pacmanLocation[1] = scope.x;
            scope.intendedDirection = RIGHT;
        });

        /* INCREMENTAL ACTION PER TIME STEP */
        function timeAction() {
            
            eatCell(scope);
            
            /* If overlap with any ghosts, let appropriate action happen. */
            if (overlapGhost(scope)) {
                scope.$emit("pgOverlap");
            }

            /* Change state of Pacman */
            scope.mouthState = (scope.mouthState+1)%NUM_MOUTH_STATES;
            agentMove(scope);
            var r = directionToDegrees(scope.direction);
            element.css({
                "-ms-transform": "rotate("+r+"deg)",
                "-webkit-transform": "rotate("+r+"deg)",
                transform: "rotate("+r+"deg)",
                left: scope.x+"px",
                top: scope.y+"px",
            });
            
            /* Update maze's perception of where pacman is */
            scope.pacmanLocation[0] = scope.y;
            scope.pacmanLocation[1] = scope.x;
        }
        
        var timeoutId = $interval(timeAction, TIME_INTERVAL*0.93); //make pacman slightly faster than ghosts...
        element.on("$destroy", function() {
            $interval.cancel(timeoutId);
        });
        scope.$on("end-game", function(event, data) {
            $interval.cancel(timeoutId);
        });
    }

    return {
        link: link,
        replace: true,
        scope: true, 
        restrict: "E",
        templateUrl: "templates/pacman-agent.html"
    };
});

