import { Bullet, COMPONENT_NAME as BULLET_NAME } from '../bullet/bullet';
import { CompletionChart, COMPONENT_NAME as COMPLETION_CHART_NAME } from '../completion-chart/completion-chart';
import { Sparkline, COMPONENT_NAME as SPARKLINE_NAME } from '../sparkline/sparkline';
import { Line, COMPONENT_NAME as LINE_NAME } from '../line/line';

/*
* jQuery Component Wrapper for Charts. It maps the singlular components
* to the previous versions single jquery wrapper.
* @param  {[type]} settings The settings to apply.
* @returns {object} The jquery object for chaining.
*/
$.fn.chart = function (settings) {
  return this.each(function () {
    let instance = $.data(this, BULLET_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      switch (settings.type) {
        case 'targeted-achievement':
        case 'completion':
        case 'completion-target': {
          const chartComponent = new CompletionChart(this, settings);
          instance = $.data(this, COMPLETION_CHART_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'bullet': {
          const chartComponent = new Bullet(this, settings);
          instance = $.data(this, BULLET_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'sparkline': {
          const chartComponent = new Sparkline(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'sparkline-dots': {
          settings.isDots = true;
          const chartComponent = new Sparkline(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'sparkline-peak': {
          settings.isPeakDot = true;
          const chartComponent = new Sparkline(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'sparkline-dots-n-peak': {
          settings.isPeakDot = true;
          settings.isDots = true;
          const chartComponent = new Sparkline(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'sparkline-minmax': {
          settings.isMinMax = true;
          const chartComponent = new Sparkline(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'sparkline-medianrange': {
          settings.isMedianRange = true;
          const chartComponent = new Sparkline(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'sparkline-medianrange-n-peak': {
          settings.isMedianRange = true;
          settings.isPeakDot = true;
          const chartComponent = new Sparkline(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'line': {
          const chartComponent = new Line(this, settings);
          instance = $.data(this, SPARKLINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'area': {
          settings.isArea = true;
          const chartComponent = new Line(this, settings);
          instance = $.data(this, LINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        case 'bubble': {
          settings.isBubble = true;
          const chartComponent = new Line(this, settings);
          instance = $.data(this, LINE_NAME, chartComponent);
          $.data(this, 'chart', chartComponent); // Compatibility
          break;
        }
        default:
          instance = null;
      }
    }
  });
};
