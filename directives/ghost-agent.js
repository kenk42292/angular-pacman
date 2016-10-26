
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
            return (scope.GRID[gridY*GRID_HEIGHT+gridX] == 0) || (scope.GRID[gridY*GRID_HEIGHT+gridX] == 1);
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
        /*function chasingDirection() {
            /* Perform a depth-limited a_star search towards pacman */
            /*var pGridY = Math.floor(state.pacmanLocation[0]/CELL_HEIGHT);
            var pGridX = Math.floor(state.pacmanLocation[1]/CELL_WIDTH);
            var gridY = Math.floor(state.y/CELL_HEIGHT);
            var gridX = Math.floor(state.x/CELL_WIDTH);
            /* The Manhattan distance heuristic */
            /*function heuristic(y, x) {
                return Math.abs(searchGridY-pGridY) + Math.abs(searchGirdX-pGridX);
            }
            /*function a_star(pGridY, pGridX, gridY, gridX) {
                
                var frontier = new goog.structs.Heap()
                frontier.insert(0, {endCoord : [gridY, gridX]
                                         firstDirection: null})
                var explored = new goog.structs.Set;
                while (!frontier.isEmpty()) {
                    frontier.pop
                }
                
                
                
                /* key: distance, value: considered paths of said distance - can be multiple paths per distance */
                /*var frontier = {0: [[[gridY, gridX]]]}
                var explored = {};
                var keys = [0];
                while keys.length != 0:
                    var dist = keys[0]
                    var path = paths[dist].pop()
                    var lastCoord = path[path.length-1]
                    for ()*/
                    
            
        //}
        
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
        var rdTimeoutId = $interval(randomDirectionChange, 15*TIME_INTERVAL*Math.max(Math.random(), 0.5));
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

