
pacmanApp.directive("pacmanAgent", function($document, $interval) {

    function link(scope, element, attrs) {
        /* INITIALIZATION */
        scope.x = 30;
        scope.y = 30;
    
        scope.mouthState = 0;
        scope.intendedDirection = scope.RIGHT;
        scope.direction = scope.RIGHT;
 

        /* USER CONTROL  */
        $document.on("keydown", function(event) {
            event.preventDefault();
            scope.intendedDirection = event.keyCode;
        });


        /* INCREMENTAL ACTION PER TIME STEP */
        function timeAction() {
            scope.mouthState = (scope.mouthState+1)%5;
            switch (scope.intendedDirection) {
                case scope.LEFT:
                case scope.RIGHT:
                    if (!(scope.y%30)) {
                        scope.direction=scope.intendedDirection;
                    }
                    break;
                case scope.UP:
                case scope.DOWN:
                    if (!(scope.x%30)) {
                        scope.direction=scope.intendedDirection;
                    }
                    break;
            }

            var r = 0;
            switch (scope.direction) {
                case scope.LEFT:
                    r = 180;
                    if (!scope.GRID[Math.floor(scope.y/30)][Math.floor((scope.x-5)/30)]) {
                        scope.x -= 5;
                    }
                    break;
                case scope.UP:
                    r = 270;
                    if (!scope.GRID[Math.floor((scope.y-5)/30)][Math.floor(scope.x/30)]) {
                        scope.y -= 5;
                    }
                    break;
                case scope.RIGHT:
                    r = 0;
                    if (!scope.GRID[Math.floor(scope.y/30)][Math.floor((scope.x+30)/30)]) {
                        scope.x += 5;
                    }
                    break;
                case scope.DOWN:
                    r = 90;
                    if (!scope.GRID[Math.floor((scope.y+30)/30)][Math.floor(scope.x/30)]) {
                        scope.y += 5;
                    }
                    break;
            }

            /* IF PELLET POSSIBLY CONSUMED, EMIT NOTIFICATION  */
            if (scope.x%30==0 && scope.y%30==0) {
                //$emit("locTraversed", scope.y/30, scope.x/30);
            }

            element.css({
                "-ms-transform": "rotate("+r+"deg)",
                "-webkit-transform": "rotate("+r+"deg)",
                transform: "rotate("+r+"deg)",
                left: scope.x+"px",
                top: scope.y+"px",
            });
        }
        var timeoutId = $interval(timeAction, 50);
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

