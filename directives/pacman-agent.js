
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
        
        scope.eatCell = function() {
            if (!(scope.y%CELL_HEIGHT) && !(scope.x%CELL_WIDTH)) {
                if (scope.GRID[scope.y/CELL_HEIGHT*GRID_WIDTH+scope.x/CELL_WIDTH]) {
                    scope.incrementScore()
                }
                scope.GRID[scope.y/CELL_HEIGHT*GRID_WIDTH+scope.x/CELL_WIDTH] = 0;
            }
        }

        function moveable(gridY, gridX) {
            return (scope.GRID[gridY*GRID_WIDTH+gridX] == 0) || (scope.GRID[gridY*GRID_WIDTH+gridX] == 1);
        }
        
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
            
            /* Eat any possible pellets on cell. */
            scope.eatCell();
            
            /* If overlap with any ghosts, die. */
            if (overlapGhost(scope.y, scope.x)) {
                console.log("Dead");
                scope.$emit("pgOverlap");
            }

            scope.mouthState = (scope.mouthState+1)%NUM_MOUTH_STATES;
            switch (scope.intendedDirection) {
                case scope.LEFT:
                case scope.RIGHT:
                    if (!(scope.y%CELL_HEIGHT)) {
                        scope.direction=scope.intendedDirection;
                    }
                    break;
                case scope.UP:
                case scope.DOWN:
                    if (!(scope.x%CELL_WIDTH)) {
                        scope.direction=scope.intendedDirection;
                    }
                    break;
            }

            var r = 0;
            switch (scope.direction) {
                case scope.LEFT:
                    r = 180;
                    if (moveable(Math.floor(scope.y/CELL_HEIGHT), Math.floor((scope.x-SPEED)/CELL_WIDTH))) {
                        scope.x -= SPEED;
                    }
                    break;
                case scope.UP:
                    r = 270;
                    if (moveable(Math.floor((scope.y-5)/CELL_HEIGHT), Math.floor(scope.x/CELL_WIDTH))) {
                        scope.y -= SPEED;
                    }
                    break;
                case scope.RIGHT:
                    r = 0;
                    if (moveable(Math.floor(scope.y/CELL_HEIGHT), Math.floor((scope.x+CELL_WIDTH)/CELL_WIDTH))) {
                        scope.x += SPEED;
                    }
                    break;
                case scope.DOWN:
                    r = 90;
                    if (moveable(Math.floor((scope.y+CELL_HEIGHT)/CELL_HEIGHT), Math.floor(scope.x/CELL_WIDTH))) {
                        scope.y += SPEED;
                    }
                    break;
            }
            
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

