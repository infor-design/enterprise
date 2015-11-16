// SoHo XI Angular Directives
(function () {

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

  var datagrid = function () {
      return {
        replace: true,
        scope: false,
        link: function(scope, elem, attrs) {

          var modelDataset = attrs.ngModelDataset,
              modelColumns = attrs.ngModelColumns;

          //Initialize
          elem.datagrid({columns: scope[modelColumns], dataset: scope[modelDataset]});

        }
      };
  };

  var datepicker = function () {
      return {
        replace: true,
        scope: false,
        link: function(scope, elem, attrs) {
          //Initialize
          elem.datepicker();
          var api = elem.data('datepicker'),
            model = attrs.ngModel,
            modelVal = scope[model],
            modelLocale = attrs.ngModelLocale;

          // Watch for Changes
          scope.$watch(model, function(newValue, oldValue) {
            if (newValue !== oldValue) {
              api.setValue(newValue);
              modelVal = newValue;
            }
          });

          scope.$watch(modelLocale, function(newValue, oldValue) {
            if (newValue !== oldValue) {
              Locale.set(newValue).done(function () {
                api.setValue(modelVal);
              });
            }
          });

          // Set Initial Value
          setTimeout(function () {
            api.setValue(modelVal);
          },0);
        }
      };
  };

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

  var popdown = function () {
      return {
        replace: true,
        scope: false,
        link: function(scope, elem) {
          elem.button().popdown();
        }
      };
  };

  var popupmenu = function () {
      return {
        replace: true,
        scope: false,
        link: function(scope, elem) {
          elem.popupmenu();
          if (elem.is(':button')) {
            elem.button();
          }
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

  var toolbar = function () {
      return {
        replace: true,
        scope: false,
        link: function(scope, elem) {
          elem.toolbar();
        }
      };
  };

  var wizard = function () {
      return {
        replace: true,
        scope: false,
        link: function(scope, elem) {

          setTimeout(function () {
            elem.wizard();
          }, 1);

        }
      };
  };

  angular.module('sohoxi-angular')
      .directive('chart', chart)
      .directive('datagrid', datagrid)
      .directive('datepicker', datepicker)
      .directive('dropdown', dropdown)
      .directive('multiselect', multiselect)
      .directive('popdown', popdown)
      .directive('popupmenu', popupmenu)
      .directive('slider', slider)
      .directive('toolbar', toolbar)
      .directive('wizard', wizard);

}());
