
pacmanApp.directive("ghostAgent", function($document, $interval) {

    function link(scope, element, attrs) {
        
        /* INITIALIZATION */
        scope.name = attrs["name"];
        
        scope.y = scope.initialGhostLocations[scope.name][0];
        scope.x = scope.initialGhostLocations[scope.name][1];
    
        scope.state = 0;
        scope.intendedDirection = RIGHT;
        scope.direction = RIGHT;
        
        scope.name = attrs.name;
        
        scope.$on("reset", function() {
            scope.y = scope.initialGhostLocations[scope.name][0];
            scope.x = scope.initialGhostLocations[scope.name][1];
            scope.ghostLocations[scope.name][0] = scope.y;
            scope.ghostLocations[scope.name][1] = scope.x;
        });
        

        
        function changeState() {
            scope.state = (scope.state+1)%NUM_GHOST_STATES;
        }

        /* INCREMENTAL ACTION PER TIME STEP */
        function timeAction() {

            agentMove(scope);
            
            /* Update maze's perception of where ghosts are */
            scope.ghostLocations[scope.name] = [scope.y, scope.x];

            element.css({
                left: scope.x+"px",
                top: scope.y+"px",
            });
        }
        var timeoutId = $interval(timeAction, TIME_INTERVAL);
        var statechangeTimeoutId = $interval(changeState, 20*TIME_INTERVAL*Math.max(Math.random(), 0.5));
        var rdTimeoutId = $interval(function() {chasingDirection(scope);}, 15*TIME_INTERVAL*Math.max(Math.random(), 0.5));
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

