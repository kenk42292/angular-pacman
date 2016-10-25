
pacmanApp.directive("ghostAgent", function($document, $interval) {

    function controller($scope) {

        /* INITIALIZATION */
        $scope.x = 5*CELL_WIDTH;
        $scope.y = 5*CELL_HEIGHT;
    
        $scope.state = 0;
        $scope.intendedDirection = $scope.RIGHT;
        $scope.direction = $scope.RIGHT;
        
    }


    function link(scope, element, attrs) {
        
        scope.name = attrs.name;

        function moveable(gridY, gridX) {
            return (scope.GRID[gridY*GRID_HEIGHT+gridX] == 0) || (scope.GRID[gridY*GRID_HEIGHT+gridX] == 1);
        }

        
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
                    if (moveable(Math.floor(scope.y/CELL_HEIGHT), Math.floor((scope.x-5)/CELL_WIDTH))) {
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

            element.css({
                "-ms-transform": "rotate("+r+"deg)",
                "-webkit-transform": "rotate("+r+"deg)",
                transform: "rotate("+r+"deg)",
                left: scope.x+"px",
                top: scope.y+"px",
            });
        }
        var timeoutId = $interval(timeAction, TIME_INTERVAL);
        var rdTimeoutId = $interval(randomDirectionChange, 300);
        element.on("$destroy", function() {
            $interval.cancel(timeoutId);
        });
        element.on("$destory", function() {
            $interval.cancel(rdTimeoutId);
        });
        
    }

    return {
        controller: controller,
        link: link,
        replace: true,
        scope: true, 
        restrict: "E",
        templateUrl: "templates/ghost-agent.html"
    };
});

