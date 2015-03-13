
// SoHo XI Angular Directives
(function () {

    var dropdown = function () {
        return {
          replace: true,
          scope: false,
          link: function(scope, elem, attrs) {
            elem.dropdown();
            var api = elem.data('dropdown'),
              model = attrs.ngModel;

            // Watch for Changes
            scope.$watch(model, function() {
             api.setValue();
            });

            // Set Initial Value
            setTimeout(function () {
              api.setValue();
            },0);
          }
        };
    };

    var other = function () {
        return {
        replace: true,
          template: '<div class="field"></div>',
        };
    };

    angular.module('sohoxi-angular')
        .directive('dropdown', dropdown)
        .directive('other', other);

}());
