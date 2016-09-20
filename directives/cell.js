
pacmanApp.directive("cell", function() {

    function link(scope, element, attrs) {
        var gridX = attrs.gridX;
        var gridY = attrs.gridY;
        

        var left = gridX*30;
        var top = gridY*30;

        scope.cellType = "brick";
        if (scope.GRID[gridY][gridX]==0) {
            scope.cellType = "pellet";
            left+=10;
            top+=10;
        }

        element.css({
            left: left + "px",
            top: top + "px"
        });
    }

    return {
        link: link,
        restrict: "E",
        replace: true,
        scope: true,
        templateUrl: "templates/cell.html",
    };
});


