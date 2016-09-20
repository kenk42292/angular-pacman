
pacmanApp.directive("pellet", function() {

    function link(scope, element, attrs) {
        var gridX = attrs.gridX;
        var gridY = attrs.gridY;
        element.css({
            left: gridX*30+10 + "px",
            top: gridY*30+10 + "px"
        });

        scope.$on("locTraversed", function(y, x) {
            console.log(y);
        });
    }

    return {
        link: link,
        restrict: "E",
        replace: true,
        scope: true,
        templateUrl: "templates/pellet.html"
    };


});


