

function moveable(scope, gridY, gridX) {
    if ((gridY < 0) || (gridY >= GRID_HEIGHT) || (gridX < 0) || (gridX >= GRID_WIDTH)) {
        return false;
    }
    return (scope.GRID[gridY*GRID_WIDTH+gridX] == 0) || (scope.GRID[gridY*GRID_WIDTH+gridX] == 1);
}

function agentMove(scope) {
    switch (scope.intendedDirection) {
        case LEFT:
        case RIGHT:
            if (!(scope.y%CELL_HEIGHT)) {
                scope.direction=scope.intendedDirection;
            }
            break;
        case UP:
        case DOWN:
            if (!(scope.x%CELL_WIDTH)) {
                scope.direction=scope.intendedDirection;
            }
            break;
    }

    var r = 0;
    switch (scope.direction) {
        case LEFT:
            r = 180;
            if (moveable(scope, Math.floor(scope.y/CELL_HEIGHT), Math.floor((scope.x-SPEED)/CELL_WIDTH))) {
                scope.x -= SPEED;
            }
            break;
        case UP:
            r = 270;
            if (moveable(scope, Math.floor((scope.y-SPEED)/CELL_HEIGHT), Math.floor(scope.x/CELL_WIDTH))) {
                scope.y -= SPEED;
            }
            break;
        case RIGHT:
            r = 0;
            if (moveable(scope, Math.floor(scope.y/CELL_HEIGHT), Math.floor((scope.x+CELL_WIDTH)/CELL_WIDTH))) {
                scope.x += SPEED;
            }
            break;
        case DOWN:
            r = 90;
            if (moveable(scope, Math.floor((scope.y+CELL_HEIGHT)/CELL_HEIGHT), Math.floor(scope.x/CELL_WIDTH))) {
                scope.y += SPEED;
            }
            break;
    }
}

function directionToDegrees(direction) {
    r = 90;
    switch (direction) {
        case LEFT:
            r = 180;
            break;
        case RIGHT:
            r = 0;
            break;
        case UP:
            r = 270;
            break;
        case DOWN:
            r = 90;
    }
    return r;
}
        
        
/** GHOST UTILITIES */
/* Random Directional Change */
function randomDirectionChange(scope) {
    var rn = Math.random();
    if (rn < 0.25) {
        scope.intendedDirection = LEFT;
    } else if (rn < 0.5) {
        scope.intendedDirection = RIGHT;
    } else if (rn < 0.75) {
        scope.intendedDirection = UP;
    } else {
        scope.intendedDirection = DOWN;
    }
}

/* Chase Pacman */
function chasingDirection(scope) {
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
                if (!explored.contains(index) && moveable(scope, Math.floor(index/GRID_WIDTH), index%GRID_WIDTH)) {
                    /* If index is where pacman is, return initialDirection needed to get there. */
                    if (index === pIndex) {
                        return initialDirection==null ? direction : initialDirection;
                    }
                    /* No weighted costs - purely distance */
                    explored.add(lastIndex);
                    frontier.insert(distSoFar+1+heuristic(Math.floor(index/GRID_WIDTH), index%GRID_WIDTH),
                                            {lastIndex : index,
                                              distSoFar : distSoFar+1,
                                              initialDirection: initialDirection==null ? direction : initialDirection});
                }
            }
        }
        return "RIGHT";
    }
    scope.intendedDirection = eval(a_star(pGridY, pGridX, gridY, gridX));
}



/** PACMAN UTILITIES */
/* Eat any possible pellets on cell. */
function eatCell(scope) {
    if (!(scope.y%CELL_HEIGHT) && !(scope.x%CELL_WIDTH)) {
        if (scope.GRID[scope.y/CELL_HEIGHT*GRID_WIDTH+scope.x/CELL_WIDTH]) {
            scope.incrementScore()
        }
        scope.GRID[scope.y/CELL_HEIGHT*GRID_WIDTH+scope.x/CELL_WIDTH] = 0;
    }
}

/** If coordinates, y, x, overlaps any ghost */
function overlapGhost(scope) {
    for (var ghostName in scope.ghostLocations) {
        if (cellSpaceOverlap(scope.y, scope.x, scope.ghostLocations[ghostName][0], scope.ghostLocations[ghostName][1])) {
            return true;
        }
    }
    return false;
}

/** If space overlaps with ghost, dead. */
function cellSpaceOverlap(y0, x0, y1, x1) {
    return (Math.abs(y1-y0) < CELL_HEIGHT) && (Math.abs(x1-x0) < CELL_WIDTH);
}

