
pacmanApp.directive("pacmanAgent", function($document, $interval) {

    function controller($scope) {

        /* INITIALIZATION */
        $scope.x = CELL_WIDTH;
        $scope.y = CELL_HEIGHT;
    
        $scope.mouthState = 0;
        $scope.intendedDirection = $scope.RIGHT;
        $scope.direction = $scope.RIGHT;

        $scope.eatCell = function() {
            if (!($scope.y%CELL_HEIGHT) && !($scope.x%CELL_WIDTH)) {
                $scope.GRID[$scope.y/CELL_HEIGHT*GRID_HEIGHT+$scope.x/CELL_WIDTH] = 0;
            }
        }

    }


    function link(scope, element, attrs) {

        /* USER CONTROL  */
        $document.on("keydown", function(event) {
            event.preventDefault();
            scope.intendedDirection = event.keyCode;
        });

        function moveable(gridY, gridX) {
            return (scope.GRID[gridY*GRID_HEIGHT+gridX] == 0) || (scope.GRID[gridY*GRID_HEIGHT+gridX] == 1);
        }


        /* INCREMENTAL ACTION PER TIME STEP */
        function timeAction() {
            scope.eatCell();
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
        element.on("$destroy", function() {
            $interval.cancel(timeoutId);
        });
    }

    return {
        controller: controller,
        link: link,
        replace: true,
        scope: true, 
        restrict: "E",
        templateUrl: "templates/pacman-agent.html"
    };
});

