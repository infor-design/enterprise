import { Bullet, COMPONENT_NAME as BULLET_NAME } from '../bullet/bullet';
import { CompletionChart, COMPONENT_NAME as COMPLETION_CHART_NAME } from '../completion-chart/completion-chart';
import { Sparkline, COMPONENT_NAME as SPARKLINE_NAME } from '../sparkline/sparkline';
import { Line, COMPONENT_NAME as LINE_NAME } from '../line/line';
import { Column, COMPONENT_NAME as COLUMN_NAME } from '../column/column';
import { Bar, COMPONENT_NAME as BAR_NAME } from '../bar/bar';
import { Pie, COMPONENT_NAME as PIE_NAME } from '../pie/pie';

/*
* jQuery Component Wrapper for Charts. It maps the singlular components
* to the previous versions single jquery wrapper.
* @param  {[type]} settings The settings to apply.
* @returns {object} The jquery object for chaining.
*/
$.fn.chart = function (settings) {
  let instance = null;
  this.empty(); // allow changing chart type

  switch (settings.type) {
    case 'targeted-achievement':
    case 'completion':
    case 'completion-target': {
      instance = $.data(this, COMPLETION_CHART_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      const chartComponent = new CompletionChart(this, settings);
      instance = $.data(this, COMPLETION_CHART_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'bullet': {
      instance = $.data(this, BULLET_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      const chartComponent = new Bullet(this, settings);
      instance = $.data(this, BULLET_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline': {
      instance = $.data(this, SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      const chartComponent = new Sparkline(this, settings);
      instance = $.data(this, SPARKLINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-dots': {
      instance = $.data(this, SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isDots = true;
      const chartComponent = new Sparkline(this, settings);
      instance = $.data(this, SPARKLINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-peak': {
      instance = $.data(this, SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isPeakDot = true;
      const chartComponent = new Sparkline(this, settings);
      instance = $.data(this, SPARKLINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-dots-n-peak': {
      instance = $.data(this, SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isPeakDot = true;
      settings.isDots = true;
      const chartComponent = new Sparkline(this, settings);
      instance = $.data(this, SPARKLINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-minmax': {
      instance = $.data(this, SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isMinMax = true;
      const chartComponent = new Sparkline(this, settings);
      instance = $.data(this, SPARKLINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-medianrange': {
      instance = $.data(this, SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isMedianRange = true;
      const chartComponent = new Sparkline(this, settings);
      instance = $.data(this, SPARKLINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-medianrange-n-peak': {
      instance = $.data(this, SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isMedianRange = true;
      settings.isPeakDot = true;
      const chartComponent = new Sparkline(this, settings);
      instance = $.data(this, SPARKLINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'line': {
      instance = $.data(this, LINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      const chartComponent = new Line(this, settings);
      instance = $.data(this, LINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'area': {
      instance = $.data(this, LINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isArea = true;
      const chartComponent = new Line(this, settings);
      instance = $.data(this, LINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'bubble': {
      instance = $.data(this, LINE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isBubble = true;
      const chartComponent = new Line(this, settings);
      instance = $.data(this, LINE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'column':
    case 'column-grouped':
    case 'column-positive-negative': {
      instance = $.data(this, COLUMN_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      const chartComponent = new Column(this, settings);
      instance = $.data(this, COLUMN_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'column-stacked': {
      instance = $.data(this, COLUMN_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isStacked = true;
      const chartComponent = new Column(this, settings);
      instance = $.data(this, COLUMN_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'bar': {
      instance = $.data(this, BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isStacked = true;
      const chartComponent = new Bar(this, settings);
      instance = $.data(this, BAR_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'bar-stacked': {
      instance = $.data(this, BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isStacked = true;
      const chartComponent = new Bar(this, settings);
      instance = $.data(this, BAR_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'bar-normalized': {
      instance = $.data(this, BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isNormalized = true;
      const chartComponent = new Bar(this, settings);
      instance = $.data(this, BAR_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'bar-grouped': {
      instance = $.data(this, BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isStacked = false;
      settings.isGrouped = true;
      const chartComponent = new Bar(this, settings);
      instance = $.data(this, BAR_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'pie': {
      instance = $.data(this, PIE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      const chartComponent = new Pie(this, settings);
      instance = $.data(this, PIE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    case 'donut': {
      instance = $.data(this, PIE_NAME);
      if (instance) {
        instance.updated(settings);
        return;
      }
      settings.isDonut = true;
      const chartComponent = new Pie(this, settings);
      instance = $.data(this, PIE_NAME, chartComponent);
      $.data(this, 'chart', chartComponent); // Compatibility
      break;
    }
    default:
      instance = null;
  }
};
