
pacmanApp.directive("cell", function() {

    function link(scope, element, attrs) {
        
        var gridIndex = parseInt(attrs.gridIndex);
        var gridY = Math.floor(gridIndex/GRID_HEIGHT);
        var gridX = gridIndex%GRID_HEIGHT;

        var left = gridX*30;
        var top = gridY*30;
        
        scope.cellType = "empty";
        
        if (scope.GRID[gridIndex]===1) {
            scope.cellType = "pellet";
            left+=10;
            top+=10;
        } else if (scope.GRID[gridIndex]===2) {
            scope.cellType = "brick";
        }
        
        /** Detect changes in cell's place in grid. */
        scope.$watch("GRID["+gridIndex+"]", function(old_value, new_value) {
            if (scope.GRID[gridY*GRID_HEIGHT + gridX]===0) {
                scope.cellType = "empty";
            }
        });

        element.css({
            left: left + "px",
            top: top + "px"
        });
    }

    return {
        link: link,
        restrict: "E",
        replace: true,
        scope: false,
        templateUrl: "templates/cell.html",
    };
});


