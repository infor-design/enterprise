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

  var multiselect = function () {
      return {
        replace: true,
        scope: false,
        link: function(scope, elem, attrs) {
          elem.multiselect();
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
            modelMin = attrs.ngModelMin,
            modelMax = attrs.ngModelMax,
            modelVal = scope[model],
            min = scope[modelMin],
            max = scope[modelMax];

          // Set Initial Value
          elem.attr('value', modelVal);

          if (max && modelMax) {
            elem.attr('max', max);
          }

          if (min && modelMin) {
            elem.attr('min', min);
          }

          elem.slider();

          // Watch for Changes
          api = elem.data('slider');

          scope.$watch(modelMax, function(newValue, oldValue) {
            if (newValue !== oldValue) {
              elem.attr('max', newValue).trigger('updated');
              api.value(modelVal);
            }
          });

          scope.$watch(modelMin, function(newValue, oldValue) {
            if (newValue !== oldValue) {
              elem.attr('min', newValue).trigger('updated');
              api.value(modelVal);
            }
          });

          scope.$watch(model, function(newValue, oldValue) {
            if (newValue !== oldValue) {
              api.value(newValue);
              modelVal = newValue;
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
      .directive('multiselect', multiselect)
      .directive('chart', chart)
      .directive('slider', slider)
      .directive('other', other);

}());
