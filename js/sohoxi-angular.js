
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

    var chart = function () {
        return {
          replace: true,
          scope: {
            dataset: '='
          },
          link: function(scope, elem, attrs) {
            elem.chart({type: attrs.chartType, dataset: scope.dataset});
          }
        };
    };

     var slider = function () {
        return {
          replace: true,
          scope: false,
          link: function(scope, elem, attrs) {
            var api,
              model = attrs.ngModel,
              modelVal = scope[model];

            // Set Initial Value
            elem.attr('value', modelVal).slider();

            // Watch for Changes
            api = elem.data('slider');
            scope.$watch(model, function(newValue, oldValue) {
              if (newValue !== oldValue) {
                api.value(newValue);
              }
            });
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
        .directive('chart', chart)
        .directive('slider', slider)
        .directive('other', other);

}());
