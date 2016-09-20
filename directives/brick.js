
pacmanApp.directive("brick", function() {

    function link(scope, element, attrs) {
        var gridX = attrs.gridX;
        var gridY = attrs.gridY;
        element.css({
            left: gridX*30 + "px",
            top: gridY*30 + "px"
        });
    }

    return {
        link: link,
        restrict: "E",
        replace: true,
        scope: true,
        templateUrl: "templates/brick.html",
    };
});


