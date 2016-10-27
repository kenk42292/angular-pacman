
pacmanApp.directive("pacmanAgent", function($document, $interval) {

    function link(scope, element, attrs) {
        
        /* INITIALIZATION */
        scope.y = scope.pacmanLocation[0];
        scope.x = scope.pacmanLocation[1];
    
        scope.mouthState = 0;
        scope.intendedDirection = scope.RIGHT;
        scope.direction = scope.RIGHT;

        /* USER CONTROL  */
        $document.on("keydown", function(event) {
            event.preventDefault();
            scope.intendedDirection = event.keyCode;
        });
        
        /** If space overlaps with ghost, dead. */
        function cellSpaceOverlap(y0, x0, y1, x1) {
            return (Math.abs(y1-y0) < CELL_HEIGHT) && (Math.abs(x1-x0) < CELL_WIDTH);
        }
        
        /** If coordinates, y, x, overlaps any ghost */
        function overlapGhost(y, x) {
            for (var ghostName in scope.ghostLocations) {
                if (cellSpaceOverlap(y, x, scope.ghostLocations[ghostName][0], scope.ghostLocations[ghostName][1])) {
                    return true;
                }
            }
            return false;
        }
        
        scope.$on("reset", function(event, mass) {
            console.log("pacman resetting...");
            scope.y = scope.initialPacmanLocation[0];
            scope.x = scope.initialPacmanLocation[1];
            scope.pacmanLocation[0] = scope.y;
            scope.pacmanLocation[1] = scope.x;
        });

        /* INCREMENTAL ACTION PER TIME STEP */
        function timeAction() {
            
            eatCell(scope);
            
            /* If overlap with any ghosts, die. */
            if (overlapGhost(scope.y, scope.x)) {
                console.log("Dead");
                scope.$emit("pgOverlap");
            }

            scope.mouthState = (scope.mouthState+1)%NUM_MOUTH_STATES;
            agentMove(scope);
            var r = directionToDegrees(scope.direction);
            
            /* Update maze's perception of where pacman is */
            scope.pacmanLocation[0] = scope.y;
            scope.pacmanLocation[1] = scope.x;

            element.css({
                "-ms-transform": "rotate("+r+"deg)",
                "-webkit-transform": "rotate("+r+"deg)",
                transform: "rotate("+r+"deg)",
                left: scope.x+"px",
                top: scope.y+"px",
            });
        }
        var timeoutId = $interval(timeAction, TIME_INTERVAL);
        element.on("$destroy", function() {
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

