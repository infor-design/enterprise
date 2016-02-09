/**
* Chart Controls
* @name Charts
* TODO:

  Make vertical bar chart (have horizontal)
  Work on update functions or routine
  Make responsive
  Make Area/Dot Chart
  Test With Screen readers
*/

window.Chart = function(container) {
  'use strict';

  var charts = this;

  //IE8 and Below Message
  if (typeof d3 === 'undefined') {
    $(container).append('<p class="chart-message"></p>');
    return null;
  }

  var colorRange = ['#1D5F8A', '#8ED1C6', '#8E72A4', '#5C5C5C', '#F2BC41', '#76B051', '#AD4242',
   '#8DC9E6', '#DE7223', '#317C73', '#EB9D9D', '#999999', '#44831F', '#C7B4DB',
   '#4EA0D1', '#6C4B81', '#AFDC91', '#69ADA3', '#DE7223', '#D8D8D8'];

  this.pieColors = d3.scale.ordinal().range(colorRange);
  this.greyColors = d3.scale.ordinal().range(['#737373', '#999999', '#bdbdbd', '#d8d8d8']);
  this.sparklineColors = d3.scale.ordinal().range(['#1D5F8A', '#999999', '#bdbdbd', '#d8d8d8']);
  this.colors = d3.scale.ordinal().range(colorRange);

  this.chartColor = function(i, chartType, data) {
    var specColor = data.color;

    //error, alert, alertYellow, good, neutral or hex
    if (specColor && specColor ==='error' ) {
      return '#e84f4f';
    }

    if (specColor && specColor ==='alert' ) {
      return '#ff9426';
    }

    if (specColor && specColor ==='alertYellow' ) {
      return '#ffd726';
    }

    if (specColor && specColor ==='good' ) {
      return '#80ce4d';
    }

    if (specColor && specColor ==='neutral' ) {
      return '#dbdbdb';
    }

    if (specColor && specColor.indexOf('#') === 0) {
      return data.color;
    }

    if (chartType === 'pie') {
      return this.pieColors(i);
    }

    if (chartType === 'column-single') {
      return '#368AC0';
    }

    if (chartType === 'bar-single') {
      return '#368AC0';
    }

    if (chartType === 'bar') {
      return this.colors(i);
    }
  };

  // Help Function to Select from legend click
  this.selectElem = function (line, series) {
    var idx = $(line).index(),
      elem = series[idx];

    if (elem.selectionObj) {
      charts.selectElement(d3.select(elem.selectionObj[0][idx]), elem.selectionInverse, elem.data);
    }
  };

  this.addLegend = function(series) {
    var i, legend = $('<div class="chart-legend"></div>');
    if (series.length === 0) {
      return;
    }

    // Legend width
    var width = 0;
    for (i = 0; i < series.length; i++) {
      width = (series[i].name && series[i].name.length > width) ? series[i].name.length : width;
    }
    width += 180;

    for (i = 0; i < series.length; i++) {
      if (!series[i].name) {
        continue;
      }

      var extraClass = '';
      if (series[i].display && (series[i].display === 'block' || series[i].display === 'twocolumn')) {
        extraClass = ' lg';
      }

      var seriesLine = $('<span class="chart-legend-item'+ extraClass +'" tabindex="0"></span>'),
        hexColor = charts.chartColor(i, (series.length === 1 ? 'bar-single' : 'bar'), series[i]);

      var color = $('<span class="chart-legend-color"></span>').css('background-color', (series[i].pattern ? 'transparent' : hexColor)),
        textBlock = $('<span class="chart-legend-item-text">'+ series[i].name + '</span>');

      if (series[i].pattern) {
        color.append('<svg width="12" height="12"><rect style="'+ hexColor +'" mask="url(#'+ series[i].pattern +')" height="12" width="12"/></svg>');
      }

      if (series[i].percent) {
        var pct = $('<span class="chart-legend-percent"></span>').text(series[i].percent);
        textBlock.append(pct);
      }

      if (series[i].display && series[i].display==='block') {
        seriesLine.css({'float':'none', 'display':'block', 'margin':'0 auto', 'width':width});
      }

      if (series[i].display && series[i].display==='twocolumn') {
        legend.css({'margin':'2em auto auto', 'border-top':'1px solid #ccc', 'padding-top':'1em'});
        if($(container).width() < 525) {
          seriesLine.css({'float':'none', 'display':'block', 'margin':'0 auto', 'width':width});
        } else {
          seriesLine.css({'float':'none', 'display':'inline-block', 'width': '45%'});
        }
      }

      seriesLine.append(color, textBlock);
      legend.append(seriesLine);
    }

    legend.on('click.chart', '.chart-legend-item', function () {
        charts.selectElem(this, series);
      }).on('keypress.chart', '.chart-legend-item', function (e) {
        if (e.which === 13 || e.which === 32) {
          charts.selectElem(this, series);
        }
      });

    $(container).append(legend);
  };

  this.renderLegend = function() {
    if (charts.legendformatter && typeof charts.legendformatter === 'function') {
      var markup = '';
      var runInterval = true,
      legendInterval = setInterval(function () {
        if(runInterval) {
          runInterval = false;
          charts.legendformatter(function (data) {
            markup = data;
          });
        }
        if(markup !== '') {
          clearInterval(legendInterval);
          $(container).append(markup);
        }
      }, 10);
    }
  };

  //Add Toolbar to the page
  this.appendTooltip = function() {
    this.tooltip = $('#svg-tooltip');
    if (this.tooltip.length === 0) {
      this.tooltip = $('<div id="svg-tooltip" class="tooltip right is-hidden"><div class="arrow"></div><div class="tooltip-content"><p><b>32</b> Element</p></div></div>').appendTo('body');
    }
  };

  this.triggerContextMenu = function(elem, d) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    d3.event.stopImmediatePropagation();

    var e = $.Event('contextmenu');
    e.target = elem;
    e.pageX = d3.event.pageX;
    e.pageY = d3.event.pageY;
    $(container).trigger(e, [elem, d]);
  };

  //Show Tooltip
  this.showTooltip = function(x, y, content, arrow) {
    this.tooltip.css({'left': x + 'px', 'top': y + 'px'})
      .find('.tooltip-content').html(content);

    this.tooltip.removeClass('bottom top left right').addClass(arrow);
    this.tooltip.removeClass('is-hidden');
  };

  this.getTooltipSize = function(content) {
    this.tooltip.find('.tooltip-content').html(content);
    return {height: this.tooltip.outerHeight(), width: this.tooltip.outerWidth()};
  };

  //Hide Tooltip
  this.hideTooltip = function() {
    d3.select('#svg-tooltip').classed('is-hidden', true).style('left', '-999px');
  };

  //Format Currency
  this.formatCurrency = function(num) {
    var symbol = (Locale.currentLocale.data ? Locale.currentLocale.data.currencySign : '$');
    num = (isNaN(num * 1)) ? 0 : num;
    return symbol + (num * 1).toFixed(2);
  };

  this.HorizontalBar = function(dataset, isNormalized, isStacked) {
    //Original http://jsfiddle.net/datashaman/rBfy5/2/
    var maxTextWidth, width, height, series, rects, svg, stack,
        xMax, xScale, yScale, yAxis, yMap, xAxis, groups, legendMap, gindex,
        totalBarsInGroup, totalGroupArea, totalHeight, gap, barHeight;

    var tooltipInterval,
      tooltipDataCache = [],
      tooltipData = charts.tooltip;

    var maxBarHeight = 30,
      legendHeight = 40,
      gapBetweenGroups = 0.5; // As of one bar height (barHeight * 0.5)

    isStacked = isStacked === undefined ? true : isStacked;

    var margins = {
      top: isStacked ? 30 : 20,
      left: 30,
      right: 30,
      bottom: 30 // 30px plus size of the bottom axis (20)
    };

    $(container).addClass('chart-vertical-bar');
    $(container).closest('.widget-content').addClass('l-center');
    $(container).closest('.card-content').addClass('l-center');

    width =  parseInt($(container).parent().width()) - margins.left - margins.right;
    height =  parseInt($(container).parent().height()) - margins.top - margins.bottom - legendHeight;  //influences the bar width

    //Get the Legend Series'
    series = dataset.map(function (d) {
      return {name: d.name, color: d.color, pattern: d.pattern};
    });

    //Map the Data Sets and Stack them.
    dataset = dataset.map(function (d) {
      return d.data.map(function (o) {
        return $.extend({}, o, {
            y: o.value,
            x: o.name,
            color: o.color,
            pattern: o.pattern
        });
      });
    });
    stack = d3.layout.stack();
    stack(dataset);

    //Calculate max text width
    maxTextWidth = 0;
    dataset = dataset.map(function (group, i) {
      if(!isStacked) {
        maxTextWidth = (series[i].name.length > maxTextWidth ? series[i].name.length : maxTextWidth);
      }
      return group.map(function (d) {
        if(isStacked) {
          maxTextWidth = (d.x.length > maxTextWidth ? d.x.length : maxTextWidth);
        }

        // Invert the x and y values, and y0 becomes x0
        return $.extend({}, d, {
            x: d.y,
            y: d.x,
            x0: d.y0,
            color: d.color,
            pattern: d.pattern
        });

      });
    });

    var h = parseInt($(container).parent().height()) - margins.bottom - (isStacked ? 0 : (legendHeight / 2)),
      w = parseInt($(container).parent().width()) - margins.left,
      textWidth = margins.left + (maxTextWidth * 6);

    svg = d3.select(container)
      .append('svg')
      .attr('width',  w)
      .attr('height', h)
      .append('g')
      .attr('class', 'group')
      .attr('transform', 'translate(' + (textWidth) + ',' + margins.top + ')');

    xMax = d3.max(dataset, function (group) {
      return d3.max(group, function (d) {
          return isStacked ? (d.x + d.x0) : d.x;
      });
    });

    if (isStacked && isNormalized) {
      var gMax = [];
      //get the max for each array group
      dataset.forEach(function(d) {
        d.forEach(function(d, i) {
        gMax[i] = (gMax[i] === undefined ? 0 : gMax[i]) + d.x;
       });
      });

      //Normalize Each Group
      dataset.forEach(function(d) {
        d.forEach(function(d, i) {
          var xDif = gMax[i]/100;
          d.x = d.x / xDif;
          d.x0 = d.x0 / xDif;
       });
      });
      xMax = 100;
    }

    //Width of he bar minus the margin
    var barWith = w - textWidth - margins.left;

    xScale = d3.scale.linear()
      .domain([0, xMax])
      .nice()
      .range([0, barWith]).nice();

    if (isStacked) {
      yMap = dataset[0].map(function (d) {
        return d.y;
      });

      barHeight = 0.32;
    } else {
      yMap = series.map(function (d) {
        return d.name;
      });

      legendMap = dataset[0].map(function (d) {
        return {'name': d.y};
      });

      gindex = 0;
      totalBarsInGroup = legendMap.length;
      totalGroupArea = height / yMap.length;
      barHeight = totalGroupArea / totalBarsInGroup;
      totalHeight = totalBarsInGroup > 1 ?
        totalGroupArea - (barHeight * gapBetweenGroups) : maxBarHeight;
      gap = totalGroupArea - totalHeight;
      maxBarHeight = totalHeight / totalBarsInGroup;
      barHeight = 0;
    }

    yScale = d3.scale.ordinal()
      .domain(yMap)
      .rangeRoundBands([0, height], barHeight, barHeight);

    xAxis = d3.svg.axis()
      .scale(xScale)
      .tickSize(-height)
      .orient('middle');

    if (isStacked && isNormalized) {
      xAxis.tickFormat(function(d) { return d + '%'; });
    }

    yAxis = d3.svg.axis()
      .scale(yScale)
      .tickSize(0)
      .orient('left');

    svg.append('g')
      .attr('class', 'axis x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'axis y')
      .call(yAxis);

    groups = svg.selectAll('g.group')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'series-group')
      .style('fill', function (d, i) {
        return charts.chartColor(i, (series.length === 1 ? 'bar-single' : 'bar'), series[i]);
      });

    rects = groups.selectAll('rect')
      .data(function (d, i) {
        d.forEach(function(d) {
          d.index = i;

          if(!isStacked) {
            d.gindex = gindex++;
          }

        });
        return d;
    })
    .enter()
    .append('rect')
    .attr('class', function(d, i) {
      return 'series-'+ i +' bar';
    })
    .style('fill', function(d, i) {
      return isStacked ?
        (charts.chartColor(d.index, (series.length === 1 ? 'bar-single' : 'bar'), dataset[0][i])) :
        (charts.chartColor(i, 'bar', dataset[d.index][i]));
    })
    .attr('mask', function (d, i) {
      if (dataset.length === 1 && dataset[0][i].pattern){
        return 'url(#' + dataset[0][i].pattern + ')';
      }

      if (series[d.index].pattern) {
        return 'url(#' + series[d.index].pattern + ')';
      }
    })
    .attr('x', function (d) {
      return isStacked ? (xScale(d.x0)) : 0;
    })
    .attr('y', function (d) {
      return isStacked ? yScale(d.y) :
        ((((totalGroupArea - totalHeight) / 2) + (d.gindex * maxBarHeight)) + (d.index * gap));
    })
    .attr('height', function () {
      return isStacked ? (yScale.rangeBand()) : maxBarHeight;
    })
    .attr('width', 0) //Animated in later
    .on('mouseenter', function (d, i) {
      var j, l,
        total = 0,
        totals = [],
        content = '',
        data = d3.select(this.parentNode).datum(),
        mid = Math.round(data.length/2),
        shape = d3.select(this),

        show = function(xPosS, yPosS, isTooltipBottom) {
          var size = charts.getTooltipSize(content),
            x = xPosS+(parseFloat(shape.attr('width'))/2)-(size.width/2),
            y = isTooltipBottom ? yPosS : (yPosS-size.height-13);

          if(content !== '') {
            charts.showTooltip(x, y, content, isTooltipBottom ? 'bottom' : 'top');
          }
        };

       if (dataset.length === 1) {
          content = '<p><b>' + d.y + ' </b>' + d.x + '</p>';
        }
        else {
          content = '<div class="chart-swatch">';

          if(isStacked) {
            for (j=0,l=dataset.length; j<l; j++) {
              total = 0;
              for (var k=0,kl=dataset.length; k<kl; k++) {
                total += dataset[k][i].x;
                totals[k] = dataset[k][i].x;
              }
              content += '<div class="swatch-row"><div style="background-color:'+charts.colors(j)+';"></div><span>'+ series[j].name +'</span><b> '+ Math.round((totals[j]/total)*100) +'% </b></div>';
            }

          }
          else {
            if(mid > 1) {
              shape = d3.select(this.parentNode).select('.series-' + mid);
            }
            for (j=0,l=data.length; j<l; j++) {
              content += '<div class="swatch-row">';
              content += '<div style="background-color:'+charts.colors(j)+';"></div>';
              content += '<span>'+ data[j].name +'</span><b>'+ data[j].value +'</b></div>';
            }
          }
          content += '</div>';
        }

        if (total > 0) {
          content = '<span class="chart-tooltip-total"><b>' + total + '</b> '+Locale.translate('Total')+'</span>' +content;
        }

        var yPosS = shape[0][0].getBoundingClientRect().top + $(window).scrollTop(),
            xPosS = shape[0][0].getBoundingClientRect().left + $(window).scrollLeft();

        var maxBarsForTopTooltip = 6,
          isTooltipBottom = (!isStacked && (data.length > maxBarsForTopTooltip));

        if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[i]) {
          content = '';
            var runInterval = true;
            tooltipInterval = setInterval(function() {
              if (runInterval) {
                runInterval = false;
                tooltipData(function (data) {
                  content = tooltipDataCache[i] = data;
                });
              }
              if (content !== '') {
                clearInterval(tooltipInterval);
                show(xPosS, yPosS, isTooltipBottom);
              }
            }, 10);
          } else {
            content = tooltipDataCache[i] || tooltipData || d.tooltip || content || '';
            show(xPosS, yPosS, isTooltipBottom);
          }
    })
    .on('mouseleave', function () {
      clearInterval(tooltipInterval);
      charts.hideTooltip();
    })
    .on('click', function (d, i) {
      var bar = d3.select(this);

      svg.selectAll('.axis.y .tick').style('font-weight', 'normal');
      svg.selectAll('.bar').style('opacity', 1);
      d3.select(this.parentNode).style('opacity', 1);

      if (this.classList && this.classList.contains('is-selected')) {
        svg.selectAll('.is-selected').classed('is-selected', false);
      } else {
        svg.selectAll('.is-selected').classed('is-selected', false);
        bar.classed('is-selected', true);
        svg.selectAll('.axis.y .tick:nth-child('+ (i+1) +')').style('font-weight', 'bolder');
        svg.selectAll('.bar:not(.series-' + i + ')').style('opacity', 0.6);
      }
      $(container).trigger('selected', [bar, d]);
    });

    //Adjust the labels
    svg.selectAll('.axis.y text').attr({'x': -15});

    //Animate the Bars In
    svg.selectAll('.bar')
      .transition().duration(1000)
      .attr('width', function (d) {
        return xScale(d.x);
      });

    //Add Legends
    charts.addLegend(isStacked ? series : legendMap);
    charts.appendTooltip();
    $(container).trigger('rendered');

    return $(container);
  };

this.Pie = function(initialData, isDonut, options) {
    var defaults = {
      labels: {
        // true|false
        isLabels: true,
        isTwoline: true,

        // 'name'|'value'|'percentage'|'name, value'|'name (value)'|'name (percentage)'
        contentsTop: 'percentage',
        contentsBottom: 'name',

        // Use d3 Format
        // http://koaning.s3-website-us-west-2.amazonaws.com/html/d3format.html
        // [null | formatter string] - Only value will be formated
        formatterTop: null,
        formatterBottom: null,

        // 'default'|'color-as-arc'|'#000000'|'black'
        colorTop: 'color-as-arc',
        colorBottom: 'default',
        lineColor: 'default',
        lineWidth: 2,
        linehideWhenMoreThanPercentage: 10
      }
    },
    settings = $.extend(true, defaults, options),
    lb = settings.labels;

    if (!lb.isTwoline && options && !options.labels.colorTop) {
      lb.colorTop = lb.colorBottom;
    }

    var self = this,
      parent = $(container).parent();

    var tooltipInterval,
      tooltipDataCache = [],
      tooltipData = charts.tooltip;

    charts.appendTooltip();

    var legendshow = charts.legendshow || false;

    var chartData = initialData[0].data;
    chartData = chartData.sort(function(a,b) {
      return +a.value - +b.value;
    });

    var total = d3.sum(chartData, function(d){ return d.value; });

    chartData = chartData.map(function (d) {
      return { elm:d, name:d.name, value:d.value, percent:d3.round(100*(d.value/total)) };
    });

    var svg = d3.select(container).append('svg'),
      arcs = svg.append('g').attr('class','arcs'),
      lines = svg.append('g').attr('class','lines'),
      centerLabel = initialData[0].centerLabel;

    $(container).addClass('chart-pie');

    var pie = d3.layout.pie().value(function (d) {
      return d.value;
    });
    // .sort(null);

    // Store our chart dimensions
    var dims = {
      height: parseInt(parent.height()),  //header + 20 px padding
      width: parseInt(parent.width()),
      widgetheight: 318
    };
    var isSmall = (dims.width < 405);
    dims.height = dims.height > dims.widgetheight ? dims.widgetheight : dims.height;
    dims.height = isSmall && !lb.isLabels ? dims.width : dims.height;

    dims.outerRadius = ((Math.min(dims.width, dims.height) / 2) - 35);
    dims.innerRadius = isDonut ? dims.outerRadius - (!lb.isLabels ? 50 : 30) : 0;
    dims.labelRadius = dims.outerRadius + 20;
    dims.center = { x: dims.width / 2, y: dims.height / 2 };

    svg.attr({
      'width': '100%',
      'height': ((isSmall && !lb.isLabels) || dims.height === dims.widgetheight) ? dims.height - 50 : '100%',
      'viewBox': '0 0 ' + dims.width + ' ' + dims.height
    });

    // move the origin of the group's coordinate space to the center of the SVG element
    arcs.attr('transform', 'translate(' + dims.center.x + ',' + dims.center.y  + ')');
    lines.attr('transform', 'translate(' + dims.center.x + ',' + dims.center.y + ')');

    var pieData = pie(chartData);

    // calculate the path information for each wedge
    var pieArcs = d3.svg.arc()
        .innerRadius(dims.innerRadius)
        .outerRadius(dims.outerRadius);

    var pieCircles = d3.svg.arc()
        .innerRadius(dims.outerRadius)
        .outerRadius(dims.outerRadius);

    var pieLabelCircles = d3.svg.arc()
        .innerRadius(dims.labelRadius)
        .outerRadius(dims.labelRadius);

    // Draw the arcs.
    var enteringArcs = arcs.selectAll('.arc').data(pieData).enter();
    enteringArcs.append('path')
      .attr('class', 'arc')
      .on('contextmenu',function (d) {
        self.triggerContextMenu(d3.select(this).select('path')[0][0], d);
      })
      .on('click', function (d, i) {
        var isSelected = d3.select(this).classed('is-selected'),
          color = charts.chartColor(i, 'pie', d.data),
          path = d3.select(this);

        d3.select('.chart-container .is-selected')
          .classed('is-selected', false)
          .style('stroke', '#fff')
          .style('stroke-width', '1px')
          .attr('transform', '');

        if (!isSelected) {
          path.classed('is-selected', true)
              .style('stroke', color)
              .style('stroke-width', 0)
              .attr('transform', 'scale(1.025, 1.025)');
          $(container).trigger('selected', [path[0], d.data]);
          return;
        }
        $(container).trigger('selected', [path[0], d.data]);
      })
      .on('mouseenter', function(d, i) {
          var size, x, y, t, tx, ty,
            offset = parent.offset(),
            content = '',
            show = function() {
              size = charts.getTooltipSize(content);
              x -= size.width/2;
              y -= size.height;

              if(content !== '') {
                charts.showTooltip(x, y, content, 'top');
              }
            };

          var circles = svg.selectAll('.pie-circle');
          t = d3.transform(d3.select(circles[0][i]).attr('transform'));
          tx = t.translate[0] + (t.translate[0] > 0 ? 10 * -1: 10 * 1);
          ty = t.translate[1] + (t.translate[1] > 0 ? 10 * -1: 10 * 1);
          x = tx + offset.left + dims.center.x;
          y = ty + offset.top + dims.center.y;

          if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[i]) {
            var runInterval = true;
            tooltipInterval = setInterval(function() {
              if(runInterval) {
                runInterval = false;
                tooltipData(function (data) {
                  content = tooltipDataCache[i] = data;
                });
              }
              if(content !== '') {
                clearInterval(tooltipInterval);
                show();
              }
            }, 10);
          } else {
            tooltipData = typeof tooltipData === 'object' ? '' : tooltipData;
            content = tooltipDataCache[i] || tooltipData || d.data.tooltip || d.data.elm.tooltip || '';
            show();
          }
        })
      .on('mouseleave', function () {
        clearInterval(tooltipInterval);
        charts.hideTooltip();
      })
      .style('fill', function(d, i) { return charts.chartColor(i, 'pie', d.data); })
      .transition().duration(750)
      .attrTween('d', function(d) {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function(t) { d.endAngle = i(t); return pieArcs(d); };
      });


    // Now we'll draw our label lines, etc.
    var textLabels, textX=[], textY=[],
      labelsContextFormatter = function (d, context, formatterString, isShortName) {
        formatterString = /percentage/i.test(context) ? '0.0%' : formatterString;
        var r,
          format = d3.format(formatterString || ''),
          percentage = format(d.value / total),
          name = isShortName ? (d.data.shortName || d.data.name.substring(0, 6) +'...') : d.data.name,
          value = formatterString && formatterString !== '0.0%' ? format(d.value) : d.value;

        // 'name'|'value'|'percentage'|'name, value'|'name (value)'|'name (percentage)'
        switch (context) {
          case 'name': r = name; break;
          case 'value': r = value; break;
          case 'percentage': r = percentage; break;
          case 'name, value': r = name + ', '  + value; break;
          case 'name (value)': r = name + ' (' + value + ')'; break;
          case 'name (percentage)': r = name + ' (' + percentage + ')'; break;
          default: r = name + ', ' + value + ' (' + percentage + ')'; break;
        }
        return r || '';
      },

      labelsColorFormatter = function (d, i, opt) {
        return opt === 'color-as-arc' ? (charts.chartColor(i, 'pie', d.data)) : (opt === 'default' ? '' : opt);
      },

      drawTextlabels = function (isShortName) {
        svg.selectAll('.lb-top').each(function(d, i) {
          d3.select(this)
            .text(function() {
              return labelsContextFormatter(d, lb.contentsTop, lb.formatterTop, isShortName);
            })
            .style({
              'font-weight': lb.isTwoline ? 'bold' : 'normal',
              'font-size': lb.isTwoline ? (dims.width > 450 ? '1.3em' : '1.1em') : '1em',
              'fill': function() {
                return labelsColorFormatter(d, i, lb.colorTop);
              }
            });
        });

        if (lb.isTwoline) {
          svg.selectAll('.lb-bottom').each(function(d, i) {
            d3.select(this)
              .text(function() {
                return labelsContextFormatter(d, lb.contentsBottom, lb.formatterBottom, isShortName);
              })
              .style({
                'font-size': '1em',
                'fill': function() {
                  return labelsColorFormatter(d, i, lb.colorBottom);
                }
              });
          });
        }
      },

      addLabels = function () {
        svg.selectAll('.labels').remove();

        var labels = svg.append('g').attr('class','labels'),
          enteringLabels = labels.selectAll('.label').data(pieData).enter(),
          labelGroups = enteringLabels.append('g').attr('class', 'label');

        labels.attr('transform', 'translate(' + dims.center.x + ',' + dims.center.y + ')');

        labelGroups.append('circle')
          .style('fill', 'none')
          .attr({'class': 'pie-circle', x: 0, y: 0, r: 1,
            transform: function (d) {
              var x = pieCircles.centroid(d)[0],
                y = pieCircles.centroid(d)[1];
              return 'translate(' + x + ',' + y + ')';
            }
          });

        labelGroups.append('circle')
          .style('fill', 'none')
          .attr({'class': 'label-circle', x: 0, y: 0, r: 1,
            transform: function (d) {
              var x = pieLabelCircles.centroid(d)[0],
                y = pieLabelCircles.centroid(d)[1];
              return 'translate(' + x + ',' + y + ')';
            }
          });

        textLabels = labelGroups.append('text').attr({
          'class': 'label-text',
          'x': function (d) {
            var centroid = pieArcs.centroid(d),
              midAngle = Math.atan2(centroid[1], centroid[0]),
              x = Math.cos(midAngle) * dims.labelRadius,
              sign = (x > 0) ? 1 : -1,
              labelX = x + (1 * sign);

            textX.push(labelX);
            return labelX;
          },
          'y': function (d) {
            var centroid = pieArcs.centroid(d),
              midAngle = Math.atan2(centroid[1], centroid[0]),
              y = Math.sin(midAngle) * dims.labelRadius;
            textY.push(y);
            return y;
          },
          'text-anchor': function (d) {
            var centroid = pieArcs.centroid(d),
             midAngle = Math.atan2(centroid[1], centroid[0]),
              x = Math.cos(midAngle) * dims.labelRadius;
            return (x > 0) ? 'start' : 'end';
          }
        });

        textLabels.append('tspan').attr('class', 'lb-top');
        if (lb.isTwoline) {
          textLabels.append('tspan')
            .attr({'class': 'lb-bottom',
              'x': function(d, i) { return textX[i]-2; },
              'dy': '18'
            });
        }

        if (lb.isLabels) {
          drawTextlabels();

          // Add center label only if its donut chart
          if (isDonut) {
            arcs.append('text')
              .attr('dy', '.35em')
              .style('text-anchor', 'middle')
              .attr('class', 'chart-donut-text')
              .text(centerLabel);
          }
        }
      };
      addLabels();

      if (lb.isLabels) {
        // Resolve label positioning collisions
        (function () {
          var spacing = Math.round(textLabels.node().getBBox().height) + 1;

          // Record org x, y position
          var orgLabelPos = textLabels[0].map(function(d) {
            d = d3.select(d);
            return { x: +d.attr('x'), y: +d.attr('y') };
          });

          // Fix y position
          function relax() {
            var again = false;
            textLabels.each(function (d, i) {
              var a = this,
                da = d3.select(a),
                y1 = +da.attr('y');

              textLabels.each(function (d2, i2) {
                if (i2 > i) {
                  var deltaY,
                    b = this,
                    db = d3.select(b),
                    y2 = +db.attr('y');

                  if (da.attr('text-anchor') === db.attr('text-anchor')) {
                    deltaY = y1 - y2;
                    if (Math.abs(deltaY) < spacing) {
                      again = true;
                      db.attr('y', y2 > 0 ? y2-1 : y2+1); //padding
                    }
                  }
                }
              });
            });

            if(again) {
              relax();
            }
          }
          relax();

          // Fix x position
          textLabels.each(function(d, i) {
            var label = d3.select(this),
              x1 = +label.attr('x'),
              y1 = +label.attr('y'),
              sign = (x1 > 0 ? 1 : -1),
              x = (dims.labelRadius - Math.abs(y1) + Math.abs(orgLabelPos[i].x + (spacing * 2.5))) * sign;

            if (orgLabelPos[i].y !== y1 || (i === 0 && chartData[i].percent < 10)) {
              label.attr('x', x);

              if (lb.isTwoline) {
                label.select('.lb-bottom').attr('x', x);
              }
            }
          });

        })();

        // Draw lines and set short name
        (function () {
          var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate('basis');

          var labels = svg.selectAll('.label'),
            labelsRect = svg.select('.labels').node().getBoundingClientRect();

            // Set short names
            if(labelsRect.left < 45 || labelsRect.width > (dims.width - 15)) {// 15: extra padding
              drawTextlabels({ isShortName: true });
              svg.selectAll('.label-text tspan').each(function() {
                if (d3.select(this).text().substring(5) === '...') {
                  legendshow = true;
                }
              });
            }

          // Collect source and targets [x, y] position
          labels.each(function(d, i) {
            var label = d3.select(this),
              pieCircle = label.select('.pie-circle'),
              labelCircle = label.select('.label-circle'),
              text = label.select('.label-text'),
              ct = d3.transform(pieCircle.attr('transform')),
              ct2 = d3.transform(labelCircle.attr('transform')),
              points = [
                { x:Number(ct.translate[0]), y:Number(ct.translate[1]) },
                { x:Number(ct2.translate[0]), y:Number(ct2.translate[1]) },
                { x:Number(text.attr('x')), y:Number(text.attr('y')) + (lb.isTwoline ? 5 : 0) }
              ];

            // Draw line from center of arc to label
            if (lb.linehideWhenMoreThanPercentage > chartData[i].percent) {
              lines.append('path')
                .attr({
                  'class': 'label-line',
                  'd': lineFunction(points)
                })
                .style({
                  'stroke-width': lb.lineWidth,
                  'stroke': function() { return labelsColorFormatter(d, i, lb.lineColor); }
                });
              }
          });

        })();
      } // END: lb.isLabels
      else {
        legendshow = true;
      }

    //Get the Legend Series'
    var series = chartData.map(function (d) {
      var name = d.name +', '+ d.value +' ('+ d.percent +'%)';
      return {name:name, display:'twocolumn'};
    });

    // Add Legends
    if (legendshow || charts.legendformatter) {
      charts[charts.legendformatter ? 'renderLegend' : 'addLegend'](series);
    }

    $(container).trigger('rendered');
    return $(container);
  };



this.elementTransform = function(options) {
    options.element.attr('transform', function () {
      var el = options.sameAs || this,
        t = d3.transform(d3.select(el).attr('transform')),
        x = t.translate[0],
        y = t.translate[1];

      x = options.addtoX ? (x>0?(x+options.addtoX):(x-options.addtoX)) : x;
      y = options.addtoY ? (y>0?(y+options.addtoY):(y-options.addtoY)) : y;
      return 'translate('+ x +','+ y +')';
    });
  };

  this.moveLabels = function(options) {
    var labelElements = options.textLabels[0];
    if (options.addtoX) {
      options.textLabels.attr('x',function() {
        var x = d3.select(this).attr('x');
        return x > 0 ? (x + options.addtoX) : (x - options.addtoX);
      });
      options.textLines.attr('x2',function(d, i) {
        var labelForLine = d3.select(labelElements[i]);
        return labelForLine.attr('x');
      });
    }
    else if (options.addtoY) {
      options.textLabels.attr('y',function() {
        var y = Number(d3.select(this).attr('y'));
        return y > 0 ? (y + options.addtoY) : (y - options.addtoY);
      });
      options.textLines.attr('y2',function(d, i) {
        var labelForLine = d3.select(labelElements[i]);
        return labelForLine.attr('y');
      });
    }
  };

  //TODO: Test this with two charts on the page.
  this.handleResize = function () {
    var timeout = null;

    //Handle Resize / Redraw
    function resizeCharts() {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        var api = $(container).data('chart'),
            cont = $(container);

        if (!cont.is(':visible')) {
          return true;
        }
        cont.empty();
        api.initChartType(api.settings);
      }, 100);
    }

    $(window).on('resize.charts', resizeCharts);
    $(container).off('resize').on('resize', resizeCharts);

  };

  // Donut Chart - Same as Pie but inner radius
  this.Ring = function(chartData) {
    return charts.Pie(chartData, true);
  };

  //Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
  this.calculateAspectRatioFit = function (d) {
    var ratio = Math.min(d.maxWidth / d.srcWidth, d.maxHeight / d.srcHeight);
    return { width: d.srcWidth*ratio, height: d.srcHeight*ratio };
  };

  // Sparkline Chart
  this.Sparkline = function(chartData, options) {
    // calculate max and min values in the NLWest data
    var max=0, min=0, len=0, i,
      dimensions = this.calculateAspectRatioFit({
        srcWidth: 385,
        srcHeight: 65,
        maxWidth: $(container).width(),
        maxHeight: 600 //container min-height
      }),
      dotsize = dimensions.width > 300 ? 4 : 3;

    for (i = 0; i < chartData.length; i++) {
      min = d3.min([d3.min(chartData[i].data), min]);
      max = d3.max([d3.max(chartData[i].data), max]);
      len = d3.max([chartData[i].data.length, len]);
    }

    var p = 10,
      w = dimensions.width,
      h = dimensions.height,
      x = d3.scale.linear().domain([0, len]).range([p, w - p]),
      y = d3.scale.linear().domain([min, max]).range([h - p, p]),
      line = d3.svg.line()
                   .x(function(d, i) { return x(i); })
                   .y(function(d) { return y(d); });

    charts.appendTooltip();
    var svg = d3.select(container)
      .append('svg')
      .attr('height', h)
      .attr('width', w);

    //Add Median Range
    //https://www.purplemath.com/modules/meanmode.htm
    if(options.isMedianRange) {
      max = d3.max(chartData[0].data);
      min = d3.min(chartData[0].data);

      var minWidth = 10,
        maxWidth = w-45,
        median = d3.median(chartData[0].data),
        range = max-min,
        scaleMedianRange = d3.scale.linear().domain([min, max]).range([0, h]),
        top = h-scaleMedianRange(median>range ? median : range),
        bot = h-scaleMedianRange(median<range ? median : range);

      svg.append('g')
        .attr('class', 'medianrange')
        .attr('transform', function() {return 'translate('+ minWidth +','+ top +')';})
        .append('rect')
        .attr('width', maxWidth)
        .attr('height', bot)
        .style('fill', '#d8d8d8')
        .on('mouseenter', function() {
          var rect = this.getBoundingClientRect(),
          content = '<p>' + (chartData[0].name ? chartData[0].name +'<br> ' : '') +
            Locale.translate('Median') + ': <b>'+ median +'</b><br>'+
            Locale.translate('Range') +': <b>'+ range +'</b>'+
            (options.isPeakDot ? '<br>'+Locale.translate('Peak') +': <b>'+ max +'</b>' : '') +'</p>',
          size = charts.getTooltipSize(content),
          x = rect.left + ((rect.width - size.width)/2),
          y = rect.top - size.height - 5; // 5: extra padding
          charts.showTooltip(x, y, content, 'top');
        })
        .on('mouseleave', function() {
          charts.hideTooltip();
        });
    }

    for (i = 0; i < chartData.length; i++) {
      var set = chartData[i],
        g = svg.append('g');
        g.append('path')
         .attr('d', line(set.data))
         .attr('stroke', options.isMinMax ? '#999999' : charts.sparklineColors(i))
         .attr('class', 'team');
    }


    //Add Dots (Dots/Peak/MinMAx)
    min = d3.min(chartData[0].data);
      svg.selectAll('.point')
        .data(chartData[0].data)
        .enter()
        .append('circle')
        .attr('r', function(d) {
          return (options.isMinMax && max === d || options.isMinMax && min === d) ? (dotsize+1) :
            (options.isDots || (options.isPeakDot && max === d)) ? dotsize : 0;
        })
        .attr('class', function(d) {
          return (options.isPeakDot && max === d && !options.isMinMax) ? 'point peak' :
            (options.isMinMax && max === d) ? 'point max' :
            (options.isMinMax && min === d) ? 'point min' : 'point';
        })
        .style('fill', function(d) {
          return (options.isPeakDot && max === d && !options.isMinMax) ? '#ffffff' :
            (options.isMinMax && max === d) ? '#56932E' :
            (options.isMinMax && min === d) ? '#941E1E' : charts.sparklineColors(0);
        })
        .style('stroke', function(d) {
          return (options.isPeakDot && max === d && !options.isMinMax) ? charts.sparklineColors(0) :
            (options.isMinMax && max === d) ? 'none' :
            (options.isMinMax && min === d) ? 'none' : '#ffffff';
        })
        .style('cursor', 'pointer')
        .attr('cx', function(d, i) { return x(i); })
        .attr('cy', function(d) { return y(d); })
        .on('mouseenter', function(d) {
          var rect = this.getBoundingClientRect(),
            content = '<p>' + (chartData[0].name ? chartData[0].name + '<br> ' +
              ((options.isMinMax && max === d) ? Locale.translate('Highest') + ': ' :
               (options.isMinMax && min === d) ? Locale.translate('Lowest') + ': ' :
               (options.isPeakDot && max === d) ? Locale.translate('Peak') + ': ' : '') : '') + '<b>' + d  + '</b></p>',
            size = charts.getTooltipSize(content),
            x = rect.left - (size.width /2) + 6,
            y = rect.top - size.height - 8;

          charts.showTooltip(x, y, content, 'top');
          d3.select(this).attr('r', (options.isMinMax && max === d ||
            options.isMinMax && min === d) ? (dotsize+2) : (dotsize+1));
        })
        .on('mouseleave', function(d) {
          charts.hideTooltip();
          d3.select(this).attr('r', (options.isMinMax && max === d ||
            options.isMinMax && min === d) ? (dotsize+1) : dotsize);
        });

    $(container).trigger('rendered');

    return $(container);
  };

  // Column Chart - Sames as bar but reverse axis
  this.Column = function(chartData, isStacked) {

    var datasetStacked,
      dataset = chartData,
      self = this,
      parent = $(container).parent(),
      isSingular = (dataset.length === 1),
      margin = {top: 40, right: 40, bottom: (isSingular && chartData[0].name === undefined ? (isStacked ? 20 : 50) : 35), left: 45},
      legendHeight = 40,
      width = parent.width() - margin.left - margin.right - 10,
      height = parent.height() - margin.top - margin.bottom - (isSingular && chartData[0].name === undefined ? (isStacked ? legendHeight : 0) : legendHeight);

    $(container).addClass('column-chart');

    var tooltipInterval,
      tooltipDataCache = [],
      tooltipData = charts.tooltip;

    var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
      .range([height, 0]);

    if (isStacked) {
      //Map the Data Sets and Stack them.
      if (isSingular) {
        datasetStacked = dataset[0].data.map(function (d) {
          return [$.extend({}, d, {
            y: d.value,
            x: d.name,
            color: d.color,
            pattern: d.pattern,
            parentName: d.name
          })];
        });
      } else {
        datasetStacked = dataset.map(function (d) {
          return d.data.map(function (o) {
            return $.extend({}, o, {
              y: o.value,
              x: o.name,
              color: o.color,
              pattern: o.pattern,
              parentName: d.name
            });
          });
        });
      }

      var stack = d3.layout.stack();
      stack(datasetStacked);

      var xScale = d3.scale.ordinal()
        .domain(d3.range(datasetStacked[0].length))
        .rangeRoundBands([0, width], 0.05);

      var yScale = d3.scale.linear()
        .domain([0,
          d3.max(datasetStacked, function(d) {
            return d3.max(d, function(d) {
              return d.y0 + d.y;
            });
          })
        ])
        .range([0, height]);
    }

    //List the values along the x axis
    var xAxisValues = dataset[0].data.map(function (d) {return d.name;});

    var xAxis = d3.svg.axis()
        .scale(x0)
        .tickSize(0)
        .tickPadding(12)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(-width)
        .tickPadding(12)
        .tickFormat(d3.format(charts.format ? charts.format : 's'))
        .orient('left');

    var svg = d3.select(container)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate('+ margin.left +','+ margin.top +')');

    // Get the Different Names
    var names = dataset.map(function (d) {
      return d.name;
    });

    //Get the Maxes of each series
    var maxesStacked, maxes = dataset.map(function (d) {
      return d3.max(d.data, function(d){ return d.value;});
    });

    if (isStacked) {
      maxesStacked = datasetStacked.map(function (d) {
        return d3.max(d, function(d){ return d.y + d.y0;});
      });
    }

    if (isSingular) {
      names = dataset[0].data.map(function (d) {
        return d.name;
      });
    }

    x0.domain(isStacked ? xAxisValues : names);
    x1.domain(xAxisValues).rangeRoundBands([0, (isSingular||isStacked) ? width : x0.rangeBand()]);
    y.domain([0, d3.max(isStacked ? maxesStacked : maxes)]).nice();

    if (!isSingular || (isSingular && !isStacked)) {
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
    }

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    //Make an Array of objects with name + array of all values
    var dataArray = [];
    chartData.forEach(function(d) {
      dataArray.push({name: d.name, shortName: d.shortName, abbrName: d.abbrName, values: d.data});
    });

    if (isSingular) {
      dataArray = [];
      names = dataset[0].data.forEach(function (d) {
        dataArray.push({name: d.name, shortName: d.shortName, abbrName: d.abbrName, value: d.value});
      });
    }

    var barMaxWidth = 25, bars;

    // Add the bars - done different depending on if grouped or singlular
    if (isSingular) {
      bars = svg.selectAll('rect')
        .data(isStacked ? datasetStacked : dataArray)
        .enter()
        .append('rect')
        .attr('width', Math.min.apply(null, [x1.rangeBand()-2, barMaxWidth]))
        .attr('x', function(d) {
          return isStacked ? xScale(0) : (x1(d.name) + (x1.rangeBand() - barMaxWidth)/2);
        })
        .attr('y', function() {
          return height;
        })
        .attr('height', function() {
          return 0;
        })
        .style('fill', function(d, i) {
          return charts.chartColor(i, 'bar', chartData[0].data[i]);
        });

        bars.transition().duration(1000)
          .attr('y', function(d) {
            return isStacked ? (height - yScale(d[0].y) - yScale(d[0].y0)) : y(d.value);
          })
          .attr('height', function(d) {
            return isStacked ? yScale(d[0].y) : (height - y(d.value));
          });
    } else {

      var xValues = svg.selectAll('.x-value')
          .data(isStacked ? datasetStacked : dataArray)
          .enter()
          .append('g')
          .attr('class', 'g')
          .style('fill', function(d, i) {
            return charts.chartColor(i, (isSingular ? 'column-single' : 'bar'), chartData[0].data[i]);
          })
          .attr('transform', function(d) {
            return 'translate(' + x0(isStacked ? xAxisValues[0] : d.name) + ',0)';
          });

        bars = xValues.selectAll('rect')
          .data(function(d) {return isStacked ? d : d.values;})
          .enter()
          .append('rect')
            .attr('width', Math.min.apply(null, [x1.rangeBand()-2, barMaxWidth]))
            .attr('x', function(d, i) {
              return isStacked ? xScale(i) : (x1(d.name) + (x1.rangeBand() - barMaxWidth)/2);
            })
            .attr('y', function() {return height;})
            .attr('height', function() {return 0;});

        bars.transition().duration(1000)
          .attr('y', function(d) { return isStacked ? (height-yScale(d.y)-yScale(d.y0)) : (y(d.value)); })
          .attr('height', function(d) { return isStacked ? yScale(d.y) : (height-y(d.value)); });
      }

      //Style the bars and add interactivity
      if(!isStacked) {
        bars.style('fill', function(d, i) {
          return charts.chartColor(i, (isSingular ? 'column-single' : 'bar'), chartData[0].data[i]);
        }).attr('mask', function (d, i) {
          return (chartData[0].data[i].pattern ? 'url(#' + chartData[0].data[i].pattern + ')' : '');
        });
      }

      bars
      // Mouseenter
      .on('mouseenter', function(d, i) {
        var x, y, j, l, size, isTooltipBottom,
          maxBarsForTopTooltip = 6,
          thisShape = this,
          shape = $(this),
          content = '',
          ePageY = d3.event.pageY,

          show = function(isTooltipBottom) {
            size = charts.getTooltipSize(content);
            x = shape[0].getBoundingClientRect().left - (size.width /2) + (shape.attr('width')/2);

            if(isStacked) {
              y = shape[0].getBoundingClientRect().top - size.height - 10;
            }
            else {
              y = ePageY-charts.tooltip.outerHeight() - 25;
              if (dataset.length > 1) {
                x = thisShape.parentNode.getBoundingClientRect().left - (size.width /2) + (thisShape.parentNode.getBoundingClientRect().width/2);
                if (isTooltipBottom) {
                  y += charts.tooltip.outerHeight() + 50;
                  if (y > (thisShape.parentNode.getBoundingClientRect().bottom + 10)) {
                    y = thisShape.parentNode.getBoundingClientRect().bottom + 10;
                  }
                } else {
                  y = thisShape.parentNode.getBoundingClientRect().top-charts.tooltip.outerHeight() + 25;
                }
              }
            }
            if(content !== '') {
              charts.showTooltip(x, y, content, isTooltipBottom ? 'bottom' : 'top');
            }
          };

        // Stacked
        if(isStacked) {
          if (isSingular) {
            content = '<p><b>'+ d[0].value +'</b> '+ d[0].name +'</p>';
          }
          else {
            content = '<div class="chart-swatch">';
            content += '<div class="swatch-caption"><b>'+ datasetStacked[0][i].name +'</b></div>';
            for(j=datasetStacked.length-1,l=0; j>=l; j--) {
              content += '<div class="swatch-row">';
              content += '<div style="background-color:'+(isSingular ? '#368AC0' : charts.colors(j))+';"></div>';
              content += '<span>'+ datasetStacked[j][i].parentName +'</span><b>'+ datasetStacked[j][i].value +'</b></div>';
            }
            content += '</div>';
          }
          size = charts.getTooltipSize(content);
          x = shape[0].getBoundingClientRect().left - (size.width /2) + (shape.attr('width')/2);
          y = shape[0].getBoundingClientRect().top - size.height - 10;
        }

        // No Stacked
        else {
          if (dataset.length === 1) {
            content = '<p><b>'+ d.value + '</b> '+ d.name +'</p>';
          }
          else {
            content = '<div class="chart-swatch">';
            var data = d3.select(this.parentNode).datum().values;

            for (j=0,l=data.length; j<l; j++) {
              content += '<div class="swatch-row">';
              content += '<div style="background-color:'+(isSingular ? '#368AC0' : charts.colors(j))+';"></div>';
              content += '<span>'+ data[j].name +'</span><b>'+ data[j].value +'</b></div>';
            }
            content += '</div>';
            isTooltipBottom = data.length > maxBarsForTopTooltip;
          }
          size = charts.getTooltipSize(content);
          x = shape[0].getBoundingClientRect().left - (size.width /2) + (shape.attr('width')/2);
          y = ePageY-charts.tooltip.outerHeight() - 25;
          if (dataset.length > 1) {
            x = this.parentNode.getBoundingClientRect().left - (size.width /2) + (this.parentNode.getBoundingClientRect().width/2);
            y = this.parentNode.getBoundingClientRect().top-charts.tooltip.outerHeight() + 25;
          }
        }

        if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[i]) {
          content = '';
          var runInterval = true;
          tooltipInterval = setInterval(function() {
            if(runInterval) {
              runInterval = false;
              tooltipData(function (data) {
                content = tooltipDataCache[i] = data;
              });
            }
            if(content !== '') {
              clearInterval(tooltipInterval);
              show();
            }
          }, 10);
        } else {
          content = tooltipDataCache[i] || tooltipData || d.tooltip || content || '';
          show(isTooltipBottom);
        }

      })

      // Mouseleave
      .on('mouseleave', function() {
        clearInterval(tooltipInterval);
        charts.hideTooltip();
      })

      // Click
      .on('click', function (d, i) {
        var bar = d3.select(this);
        charts.selectElement(bar, svg.selectAll('rect'), d);

        if(!isSingular) {
          var index = isStacked ? i : names.indexOf(d3.select(this.parentNode).datum().name);
            if (index > -1) {
              charts.selectElement(svg.selectAll('.x .tick:nth-child('+(index+1)+')'), svg.selectAll('.x .tick'), d);
            }
          }
        return;
      })

      // Contextmenu
      .on('contextmenu',function (d) {
        self.triggerContextMenu(d3.select(this)[0][0], d);
      });

    //Add Legend
    var seriesStacked, series = xAxisValues.map(function (d) {
      return {name: d};
    });

    if (isSingular && chartData[0].name) {
      charts.addLegend([{name: chartData[0].name}]);
    }

    if (isStacked && !isSingular) {
      seriesStacked = names.map(function (d) {
        return {name: d};
      });
    }

    if (isStacked && isSingular) {
      charts.addLegend(series);
    } else if (!isSingular) {
      charts.addLegend(isStacked ? seriesStacked : series);
    }

    //Add Tooltips
    charts.appendTooltip();

    //See if any labels overlap and use shorter */
    if (charts.labelsColide(svg)) {
      charts.applyAltLabels(svg, dataArray, 'shortName');
    }

    if (charts.labelsColide(svg)) {
      charts.applyAltLabels(svg, dataArray, 'abbrName');
    }

    $(container).trigger('rendered');
    return $(container);
  };

  this.labelsColide = function(svg) {
    var ticks = svg.selectAll('.x text'),
      collides = false;

    ticks.each(function(d, i) {
      var rect1 = this.getBoundingClientRect(), rect2;

      ticks.each(function(d, j) {
        if (i !== j) {
          rect2 = this.getBoundingClientRect();

          var overlap = !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);

          if (overlap) {
            collides = true;
          }
        }

      });
    });

    return collides;
  };

  this.applyAltLabels = function(svg, dataArray, elem, selector) {
    var ticks = selector ? svg.selectAll(selector) : svg.selectAll('.x text');

    ticks.each(function(d, i) {
      var text = dataArray[i][elem];
      text = text || d3.select(this).text().substring(0, 6) +'...';
      d3.select(this).text(text);
    });
  };

  this.Line = function(chartData, options, isArea) {
    $(container).addClass('line-chart');

    //Append the SVG in the parent area.
    var dataset = chartData,
      hideDots = (options.hideDots),
      parent = $(container).parent(),
      margin = {top: 30, right: 55, bottom: 35, left: 65},
      width = parent.width() - margin.left - margin.right,
      height = parent.height() - margin.top - margin.bottom - 30; //legend

    var svg = d3.select(container).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //Calculate the Domain X and Y Ranges
    var x = d3.scale.linear().range([0, width]),
      y = d3.scale.linear().range([height, 0]);

    var maxes = dataset.map(function (d) {
      return d3.max(d.data, function(d){ return d.value;});
    });

    var entries = d3.max(dataset.map(function(d){ return d.data.length;})) -1,
      xScale = x.domain([0, entries]),
      yScale = y.domain([0, d3.max(maxes)]).nice();

    var names = dataset[0].data.map(function (o) {
      return o.name;
    });

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickSize(0)
      .ticks(entries)
      .tickPadding(10)
      .tickFormat(function (d, i) {
        return names[i];
      });

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .tickSize(-(width + 20))
      .tickPadding(20)
      .orient('left');

    //Append The Axis to the svg
    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    //Offset the tick inside, uses the fact that the yAxis has 20 added.
    svg.selectAll('.tick line').attr('x1', '-10');

    // Create the line generator
    var line = d3.svg.line()
      .x(function(d, i) {
        return xScale(i);
      })
      .y(function(d) {
        return yScale(d.value);
      });

    //append the three lines.
    dataset.forEach(function(d, i) {

      var lineGroups = svg.append('g')
        .attr('class', 'line-group');

      if (isArea) {
        var area = d3.svg.area()
          .x(function(d, i) {
            return xScale(i);
          })
          .y0(height)
          .y1(function(d) {
            return yScale(d.value);
          });

        lineGroups.append('path')
          .datum(d.data)
          .attr('fill', charts.colors(i))
          .style('opacity', '.2')
          .attr('class', 'area')
          .attr('d', area);
      }

      var path = lineGroups.append('path')
        .attr('d', line(d.data))
        .attr('stroke', charts.colors(i))
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('class', 'line')
        .on('click.chart', function(d) {
          charts.selectElement(d3.select(this.parentNode), svg.selectAll('.line-group'), d);
        });

      // Add animation
      var totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
          .duration(750)
          .ease('cubic')
          .attr('stroke-dashoffset', 0);

      if (!hideDots) {
          lineGroups.selectAll('circle')
          .data(d.data)
          .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('cx', function (d, i) { return xScale(i); })
          .attr('cy', function (d) { return yScale(d.value); })
          .attr('r', 5)
          .style('stroke', '#ffffff')
          .style('stroke-width', 2)
          .style('fill', charts.colors(i))
          .on('mouseenter.chart', function(d) {
            var rect = d3.select(this)[0][0].getBoundingClientRect() ,
              content = '<p><b>' + d.name + ' </b> ' + d.value + '</p>',
              size = charts.getTooltipSize(content),
              x = rect.x - (size.width /2) + 6,
              y = rect.y - size.height - 18 + $(window).scrollTop();

            charts.showTooltip(x, y, content, 'top');

            //Circle associated with hovered point
            d3.select(this).attr('r', 7);
          }).on('mouseleave.chart', function() {
            charts.hideTooltip();
            d3.select(this).attr('r', 5);
          }).on('click.chart', function(d) {
            charts.selectElement(d3.select(this.parentNode), svg.selectAll('.line-group'), d);
          });
      }

    });

    var series = dataset.map(function (d) {
      return {name: d.name, selectionObj: svg.selectAll('.line-group'), selectionInverse: svg.selectAll('.line-group'), data: d};
    });

    charts.addLegend(series);
    charts.appendTooltip();

    $(container).trigger('rendered');


    return $(container);
  };

  this.Bullet = function(chartData) {
    $(container).addClass('bullet-chart');

    //Append the SVG in the parent area.
    var dataset = chartData,
      noMarkers = false,
      parent = $(container).parent(),
      margin = {top: 30, right: 55, bottom: 35, left: 65},
      width = parent.width() - margin.left - margin.right,
      height = parent.height() - margin.top - margin.bottom - 30; //legend

    var svg = d3.select(container).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //Functions Used in the Loop
    function bulletWidth(x) {
      var x0 = x(0);
      return function(d) {
        return Math.abs(x(d) - x0);
      };
    }

    for (var i = 0; i < dataset[0].data.length; i++) {
      var duration = 600,
          barHeight = 25,
          rowData = dataset[0].data[i],
          ranges = rowData.ranges.slice().sort(d3.descending),
          markers = (rowData.markers ? rowData.markers.slice().sort(d3.descending) : []),
          measures = (rowData.measures ? rowData.measures.slice().sort(d3.descending) : []);

      if (markers.length === 0) {
        markers = measures;
        noMarkers = true;
      }

      var g = svg.append('g')
              .attr('class', 'bullet')
              .attr('transform', 'translate(0, ' + (i * (barHeight*3)) + ')');

      //Add Title and Subtitle
      var title = g.append('g');

      var text = title.append('text')
          .attr('class', 'title')
          .attr('dy', '-6px')
          .text(function() { return rowData.title; });

      text.append('tspan')
          .attr('class', 'subtitle')
          .attr('dx', '15px')
          .text(function() { return rowData.subtitle; });

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain([0, Math.max(ranges[0], markers[0], measures[0])])
          .range([0, width]);

      // Derive width-scales from the x-scales.
      var w1 = bulletWidth(x1);

      // Update the range rects.
      var range = g.selectAll('rect.range')
          .data(ranges);

      var tooltipInterval;

      range.enter().append('rect')
          .attr('class', function(d, i) { return 'range s' + i; })
          .attr('data-idx', i)
          .attr('width', 0)
          .style('fill', function(d,i) {
            if (chartData[0].barColors) {
              return chartData[0].barColors[i];
            }
          })
          .attr('height', barHeight)
          .on('click', function () {
            var bar = d3.select(this);
            $(container).trigger('selected', [bar, chartData[0].data[bar.attr('data-idx')]]);
          })
          .on('mouseenter', function(d, i) {

            var bar = d3.select(this),
              data = chartData[0].data[bar.attr('data-idx')],
              rect = d3.select(this)[0][0].getBoundingClientRect(),
              next = d3.select(this.nextSibling),
              content = '<p>' + d + '</p>',
              size = charts.getTooltipSize(content),
              x = 0,
              y = rect.top - size.height + $(window).scrollTop() - 5,
              w = d3.select(this).attr('width'),
              nextWidth = next.attr('width');

            if (nextWidth && next.classed('range')) {
              var sliceW = (w - nextWidth) / 2;
              x = (rect.left + (w - sliceW) - (size.width/2));
            } else {
              x = rect.left + (rect.width/2) - (size.width/2);
            }

            if (data.tooltip && data.tooltip[i]) {
              content = data.tooltip[data.tooltip.length - i -1];
            }

            tooltipInterval = setTimeout(function() {
              charts.showTooltip(x, y, content, 'top');
            }, 300);

          })
          .on('mouseleave', function() {
            clearInterval(tooltipInterval);
            charts.hideTooltip();
          });


      range.transition()
          .duration(duration)
          .attr('width', w1);

      // Update the measure rects.
      var measure = g.selectAll('rect.measure')
          .data(measures);

      measure.enter().append('rect')
          .attr('class', function(d, i) { return 'measure s' + i; })
          .attr('width', 0)
          .attr('height', 3)
          .style('fill', function(d,i) {
            if (chartData[0].lineColors) {
              return chartData[0].lineColors[i];
            }
          })
          .attr('y', 11);

      measure.transition()
          .duration(duration)
          .attr('width', w1);

      // Update the marker lines.
      var marker = g.selectAll('line.marker')
          .data(markers);

      marker.enter().append('line')
          .attr('class', (noMarkers ? 'hidden' : 'marker'))
          .attr('x1', 0)
          .attr('x2', 0)
          .style('stroke', function(d,i) {
            if (chartData[0].markerColors) {
              return chartData[0].markerColors[i];
            }
          })
          .attr('y1', barHeight / 6)
          .attr('y2', barHeight * 5 / 6);

      marker.transition()
          .duration(duration)
          .attr('x1', x1)
          .attr('x2', x1)
          .attr('y1', barHeight / 6)
          .attr('y2', barHeight * 5 / 6);

      //Difference
      var dif = (markers[0] > measures[0] ? '-' : '+') + Math.abs(markers[0] - measures[0]);

      if (Math.abs(markers[0] - measures[0]) !== 0) {
        marker.enter().append('text')
            .attr('class', 'inverse')
            .attr('text-anchor', 'middle')
            .attr('y', barHeight /2 + 4)
            .attr('dx', '-50px')
            .attr('x', 0)
            .text(dif);
      }

      marker.transition()
          .duration(duration)
          .attr('x', width);  //x1

      // Update the tick groups.
      var tick = g.selectAll('g.tick')
          .data(x1.ticks(8));

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append('g')
          .attr('class', 'tick')
          .attr('transform', 'translate(0,0)')
          .style('opacity', 0);

      tickEnter.append('line')
          .attr('y1', barHeight)
          .attr('y2', barHeight * 7 / 6);

      tickEnter.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '1.1em')
          .attr('y', barHeight * 7 / 6)
          .text(function (d) {
            return d;
          });

      // Transition the entering ticks to the new scale, x1.
      tickEnter.transition()
          .duration(duration)
          .attr('transform', function (d) {
            return 'translate(' + x1(d) + ',0)';
          })
          .style('opacity', 1);
    }

    //Add Legends
    //charts.addLegend(isStacked ? series);
    charts.appendTooltip();
    $(container).trigger('rendered');

  };

  //Select the element and fire the event, make the inverse selector opace
  this.selectElement = function(elem, inverse, data) {
    var isSelected = elem.classed('is-selected');

    inverse.classed('is-not-selected', false)
      .classed('is-selected', false)
      .classed('is-not-selected', !isSelected);

     elem.classed('is-not-selected', false)
        .classed('is-selected', !isSelected);

    //Fire Events
     $(container).trigger('selected', [elem, data]);
  };

  this.initChartType = function (options) {
    if (options.format) {
      this.format = options.format;
    }
    if (options.tooltip) {
      this.tooltip = options.tooltip;
    }
    if (options.legendshow) {
      this.legendshow = options.legendshow;
    }
    if (options.legendformatter) {
      this.legendformatter = options.legendformatter;
    }
    if (options.type === 'pie') {
      this.Pie(options.dataset, false, options);
    }
    if (options.type === 'bar' || options.type === 'bar-stacked') {
      this.HorizontalBar(options.dataset);
    }
    if (options.type === 'bar-normalized') {
      this.HorizontalBar(options.dataset, true);
    }
    if (options.type === 'bar-grouped') {
      this.HorizontalBar(options.dataset, true, false); //dataset, isNormalized, isStacked
    }
    if (options.type === 'column-stacked') {
      this.Column(options.dataset, true);
    }
    if (options.type === 'column' || options.type === 'column-grouped') {
      this.Column(options.dataset);
    }
    if (options.type === 'donut') {
      this.Pie(options.dataset, true, options);
    }
    if (options.type === 'sparkline') {
      this.Sparkline(options.dataset, options);
    }
    if (options.type === 'sparkline-dots') {
      this.Sparkline(options.dataset, {isDots: true});
    }
    if (options.type === 'sparkline-peak') {
      this.Sparkline(options.dataset, {isPeakDot: true});
    }
    if (options.type === 'sparkline-dots-n-peak') {
      this.Sparkline(options.dataset, {isDots: true, isPeakDot: true});
    }
    if (options.type === 'sparkline-minmax') {
      this.Sparkline(options.dataset, {isMinMax: true});
    }
    if (options.type === 'sparkline-medianrange') {
      this.Sparkline(options.dataset, {isMedianRange: true});
    }
    if (options.type === 'sparkline-medianrange-n-peak') {
      this.Sparkline(options.dataset, {isMedianRange: true, isPeakDot: true});
    }
    if (options.type === 'line') {
      this.Line(options.dataset, options);
    }
    if (options.type === 'area') {
      this.Line(options.dataset, options, true);
    }
    if (options.type === 'bullet') {
      this.Bullet(options.dataset, options);
    }
  };

};

//Make it a plugin
$.fn.chart = function(options) {
  return this.each(function() {
    var instance = $.data(this, 'chart'),
      chartInst;

    if (instance) {
      $(window).off('resize.line');
      $(window).off('resize.pie');
      $(window).off('resize.charts load.charts');
      $(this).empty();
    }

    chartInst = new Chart(this, options);
    instance = $.data(this, 'chart', chartInst);
    instance.settings = options;

    if ($.isEmptyObject(chartInst)) {
     return;
    }

    setTimeout(function () {
      chartInst.initChartType(options);
      chartInst.handleResize();
    }, 300);

  });
};
