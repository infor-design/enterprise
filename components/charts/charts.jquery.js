import { Bullet, COMPONENT_NAME as BULLET_NAME } from '../bullet/bullet';
import { CompletionChart, COMPONENT_NAME as COMPLETION_CHART_NAME } from '../completion-chart/completion-chart';
import { Sparkline, COMPONENT_NAME as SPARKLINE_NAME } from '../sparkline/sparkline';
import { Line, COMPONENT_NAME as LINE_NAME } from '../line/line';
import { Column, COMPONENT_NAME as COLUMN_NAME } from '../column/column';
import { Bar, COMPONENT_NAME as BAR_NAME } from '../bar/bar';
import { Pie, COMPONENT_NAME as PIE_NAME } from '../pie/pie';
import { Radar, COMPONENT_NAME as RADAR_NAME } from '../radar/radar';

/*
* jQuery Component Wrapper for Charts. It maps the singlular components
* to the previous versions single jquery wrapper.
* @param  {object} settings The settings to apply.
* @returns {object} The jquery object for chaining.
*/
$.fn.chart = function (settings) {
  let instance = null;
  this.empty(); // allow changing chart type

  switch (settings.type) {
    case 'targeted-achievement':
    case 'completion':
    case 'completion-target': {
      instance = this.data(settings.type);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new CompletionChart(this, settings);
      this.data(COMPLETION_CHART_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      this.data(settings.type, chartComponent); // Compatibility
      break;
    }
    case 'bullet': {
      instance = this.data(BULLET_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Bullet(this, settings);
      this.data(BULLET_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'radar': {
      instance = this.data(RADAR_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Radar(this, settings);
      this.data(RADAR_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline': {
      instance = this.data(SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Sparkline(this, settings);
      this.data(SPARKLINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-dots': {
      settings.isDots = true;
      instance = this.data(SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Sparkline(this, settings);
      this.data(SPARKLINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-peak': {
      settings.isPeakDot = true;
      instance = this.data(SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Sparkline(this, settings);
      this.data(SPARKLINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-dots-n-peak': {
      settings.isPeakDot = true;
      settings.isDots = true;
      instance = this.data(SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Sparkline(this, settings);
      this.data(SPARKLINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-minmax': {
      settings.isMinMax = true;
      instance = this.data(SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Sparkline(this, settings);
      this.data(SPARKLINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-medianrange': {
      settings.isMedianRange = true;
      instance = this.data(SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Sparkline(this, settings);
      this.data(SPARKLINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'sparkline-medianrange-n-peak': {
      settings.isMedianRange = true;
      settings.isPeakDot = true;
      instance = this.data(SPARKLINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Sparkline(this, settings);
      this.data(SPARKLINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'line': {
      instance = this.data(LINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Line(this, settings);
      this.data(LINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'area': {
      settings.isArea = true;
      instance = this.data(LINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Line(this, settings);
      this.data(LINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'bubble': {
      settings.isBubble = true;
      instance = this.data(LINE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Line(this, settings);
      this.data(LINE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'column':
    case 'column-grouped':
    case 'positive-negative':
    case 'column-positive-negative': {
      instance = this.data(COLUMN_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Column(this, settings);
      this.data(COLUMN_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'column-stacked': {
      settings.isStacked = true;
      instance = this.data(COLUMN_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Column(this, settings);
      this.data(COLUMN_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'bar': {
      settings.isStacked = true;
      instance = this.data(BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Bar(this, settings);
      this.data(BAR_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'bar-stacked': {
      settings.isStacked = true;
      instance = this.data(BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Bar(this, settings);
      this.data(BAR_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'bar-normalized': {
      settings.isNormalized = true;
      instance = this.data(BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Bar(this, settings);
      this.data(BAR_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'bar-grouped': {
      settings.isStacked = false;
      settings.isGrouped = true;
      instance = this.data(BAR_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Bar(this, settings);
      this.data(BAR_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'pie': {
      instance = this.data(PIE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Pie(this, settings);
      this.data(PIE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    case 'donut': {
      settings.isDonut = true;
      instance = this.data(PIE_NAME);
      if (instance) {
        instance.updated(settings);
        return this;
      }
      const chartComponent = new Pie(this, settings);
      this.data(PIE_NAME, chartComponent);
      this.data('chart', chartComponent); // Compatibility
      break;
    }
    default:
      instance = null;
  }

  return this;
};
