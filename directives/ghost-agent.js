
pacmanApp.directive("ghostAgent", function($document, $interval) {

    function link(scope, element, attrs) {
        
        /* INITIALIZATION */
        scope.name = attrs["name"];
        
        scope.y = scope.initialGhostLocations[scope.name][0];
        scope.x = scope.initialGhostLocations[scope.name][1];
    
        scope.state = 0;
        scope.intendedDirection = scope.RIGHT;
        scope.direction = scope.RIGHT;
        
        scope.name = attrs.name;

        function moveable(gridY, gridX) {
            if ((gridY < 0) || (gridY >= GRID_HEIGHT) || (gridX < 0) || (gridX >= GRID_WIDTH)) {
                return false;
            }
            return (scope.GRID[gridY*GRID_WIDTH+gridX] == 0) || (scope.GRID[gridY*GRID_WIDTH+gridX] == 1);
        }
        
        scope.$on("reset", function() {
            scope.y = scope.initialGhostLocations[scope.name][0];
            scope.x = scope.initialGhostLocations[scope.name][1];
            scope.ghostLocations[scope.name][0] = scope.y;
            scope.ghostLocations[scope.name][1] = scope.x;
        });
        
        /**** Movement Strategies of the Four Ghosts ****/
        /* RANDOM DIRECTIONAL CHANGE */
        function randomDirectionChange() {
            var rn = Math.random();
            if (rn < 0.25) {
                scope.intendedDirection = scope.LEFT;
            } else if (rn < 0.5) {
                scope.intendedDirection = scope.RIGHT;
            } else if (rn < 0.75) {
                scope.intendedDirection = scope.UP;
            } else {
                scope.intendedDirection = scope.DOWN;
            }
        }
        /* Chase Pacman */
        function chasingDirection() {
            /* Perform a depth-limited a_star search towards pacman */
            var pGridY = Math.floor(scope.pacmanLocation[0]/CELL_HEIGHT);
            var pGridX = Math.floor(scope.pacmanLocation[1]/CELL_WIDTH);
            var pIndex = pGridY*GRID_WIDTH + pGridX;
            var gridY = Math.floor(scope.y/CELL_HEIGHT);
            var gridX = Math.floor(scope.x/CELL_WIDTH);
            /* The Manhattan distance heuristic */
            function heuristic(gridY, gridX) {
                return Math.abs(gridY-pGridY) + Math.abs(gridX-pGridX);
            }
            /* The return type is a STRING representative of the direction. Caller must take this and change to appropriate number... */
            function a_star(pGridY, pGridX, gridY, gridX) {
                var frontier = new goog.structs.Heap()
                frontier.insert(heuristic(gridY, gridX),
                                        {lastIndex : gridY*GRID_WIDTH+gridX,
                                          distSoFar : 0,
                                          initialDirection: null});
                var explored = new goog.structs.Set;
                var vals, lastIndex, distSoFar, initialDirection, possibleDirections, index;
                while (!frontier.isEmpty()) {
                    vals = frontier.remove();
                    lastIndex = vals["lastIndex"];
                    distSoFar = vals["distSoFar"];
                    initialDirection = vals["initialDirection"];
                    
                    explored.add(lastIndex);
                    /* Possible Directions to go from lastIndex, and which index it'll take me to. Keys will always be strings in JS... */
                    possibleDirections = {
                        "LEFT" : lastIndex-1,
                        "RIGHT" : lastIndex+1,
                        "UP" : lastIndex-GRID_WIDTH,
                        "DOWN" : lastIndex+GRID_WIDTH
                    };
                    for (var direction in possibleDirections) {
                        index = possibleDirections[direction];
                        if (!explored.contains(index) && moveable(Math.floor(index/GRID_WIDTH), index%GRID_WIDTH)) {
                            /* If index is where pacman is, return initialDirection needed to get there. */
                            if (index === pIndex) {
                                return initialDirection==null ? direction : initialDirection;
                            }
                            frontier.insert(distSoFar+1+heuristic(Math.floor(index/GRID_WIDTH), index%GRID_WIDTH),
                                                    {lastIndex : index,
                                                      distSoFar : distSoFar+1,
                                                      initialDirection: initialDirection==null ? direction : initialDirection});
                        }
                    }
                }
                return "RIGHT";
            }
            scope.intendedDirection = scope[a_star(pGridY, pGridX, gridY, gridX)];
        }
        
        /* Scatter */
        
        function changeState() {
            scope.state = (scope.state+1)%NUM_GHOST_STATES;
        }

        /* INCREMENTAL ACTION PER TIME STEP */
        function timeAction() {

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
                    if (moveable(Math.floor((scope.y-SPEED)/CELL_HEIGHT), Math.floor(scope.x/CELL_WIDTH))) {
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
            
            /* Update maze's perception of where ghosts are */
            scope.ghostLocations[scope.name] = [scope.y, scope.x];

            element.css({
                left: scope.x+"px",
                top: scope.y+"px",
            });
        }
        var timeoutId = $interval(timeAction, TIME_INTERVAL);
        var statechangeTimeoutId = $interval(changeState, 20*TIME_INTERVAL*Math.max(Math.random(), 0.5));
        var rdTimeoutId = $interval(chasingDirection, 15*TIME_INTERVAL*Math.max(Math.random(), 0.5));
        element.on("$destroy", function() {
            $interval.cancel(timeoutId);
            $interval.cancel(rdTimeoutId);
            $interval.cancel(statechangeTimeoutId);
        });
        
    }

    return {
        link: link,
        replace: true,
        scope: true, 
        restrict: "E",
        templateUrl: "templates/ghost-agent.html"
    };
});

