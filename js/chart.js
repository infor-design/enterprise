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
     $(container).append('<p class="chart-message">'+Locale.translate('Unsupported')+'</p>');
    return null;
  }

  var colorRange = ['#1D5F8A', '#8ED1C6', '#9279A6', '#5C5C5C', '#F2BC41', '#66A140',
   '#B94E4E', '#8DC9E6', '#DB7726', '#317C73', '#EB9D9D', '#999999', '#488421', '#C7B4DB', '#54A1D3', '#6E5282',
   '#AFDC91', '#69ADA3', '#DB7726', '#D8D8D8'];

  this.pieColors = d3.scale.ordinal().range(colorRange);
  this.greyColors = d3.scale.ordinal().range(['#737373', '#999999', '#bdbdbd', '#d8d8d8']);
  this.barColors = d3.scale.ordinal().range(colorRange);

  // Function to Add a Legend
  this.addLegend = function(series) {
    var legend = $('<div class="chart-legend"></div>');
    if (series.length === 0) {
      return;
    }

    for (var i = 0; i < series.length; i++) {
      if (!series[i].name) {
        continue;
      }

      var seriesLine = $('<span class="chart-legend-item" tabindex="0"></span>'),
        color = $('<div class="chart-legend-color"></div>').css('background-color', charts.barColors(i)),
        textBlock = $('<span class="chart-legend-item-text">'+ series[i].name + '</span>');

      if (series[i].percent) {
        var pct = $('<span class="chart-legend-percent"></span>').text(series[i].percent);
        textBlock.append(pct);
      }

      seriesLine.append(color, textBlock);
      legend.append(seriesLine);
    }

    legend.on('click.chart focus.chart', '.chart-legend-item', function () {
      // For Bar and series charts
      var triggerIdx = $(this).index(),
          bars = $(container).find('.bar'),
          targetGroup = $(this).closest('.chart-legend').siblings('.chart-container').find('svg .series-group').eq(triggerIdx);

        bars.css('opacity', 1);
        targetGroup.css({
          'opacity': 1
        })
        .siblings('.series-group').css({
          'opacity': 0.5
        });

    });

    $(container).after(legend);
  };

  //Add Toolbar to the page
  this.appendTooltip = function() {
    this.tooltip = $('#svg-tooltip');
    if (this.tooltip.length === 0) {
      this.tooltip = $('<div id="svg-tooltip" class="tooltip right is-hidden"><div class="arrow"></div><div class="tooltip-content"><p><b>32</b> Element</p></div></div>').appendTo('body');
    }
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

  this.Bar = function(dataset) {
    var margins = {
      top: 30,
      left: 30,
      right: 30,
      bottom: 30
    };

    var isSingular = (dataset.length === 1);

    var w = $(container).parent().width() - margins.left - margins.right,
      h = $(container).parent().height() - margins.top - (isSingular ? 0 : 20),
      barWidth = 30,
      spaceWidth = 30,
      y,
      stack,
      x = d3.scale.ordinal().rangeRoundBands([0, w - margins.left - margins.right]);

    $(container).addClass('chart-bar');

    var svg = d3.select(container).append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate(' + (margins.left) + ',' + (h - margins.top + 8) + ')');

    //Map the Series Tags for the Legend
    var series = dataset.map(function (d) {
      return {name: d.name};
    });

    //Map the Data Sets and Stack them.
    dataset = dataset.map(function (d) {
      return d.data.map(function (o) {
           return {
              x: o.name,
              y: o.value
          };
      });
    });
    stack = d3.layout.stack();
    stack(dataset);

    // Compute the x-domain (by date) and y-domain (by top).
    x.domain(dataset[0].map(function(d) { return d.x; }));
    y = d3.scale.linear()
      .domain([0, d3.max(dataset[dataset.length - 1], function(d) { return d.y0 + d.y; })])
      .nice()
      .range([0, h - margins.top - margins.bottom]);

    // Add y-axis rules.
    var rule = svg.selectAll('g.rule')
      .data(y.ticks(5))
    .enter().insert('g')
      .attr('class', 'rule')
      .attr('transform', function(d) { return 'translate(0,' + -y(d) + ')'; });

    rule.append('line')
      .attr('x2', w - margins.right - margins.left + spaceWidth)
      .style('stroke', function(d) { return d ? '#b3b3b3' : '#c0c0c0'; });

    rule.append('text')
      .attr('x', -20)
      .attr('dy', '.35em')
      .text(d3.format(',d'));

    // Add a label per date.
    svg.append('g').attr('class', 'y-axis')
      .selectAll('text.label')
      .data(x.domain())
    .enter().append('text')
      .attr('x', function(d) { return x(d) + barWidth / 2 + spaceWidth; })
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('dy', '.75em')
       .attr('class', 'label')
      .text(function (d) {return d;});

    // Add a group for each
    stack = svg.selectAll('g.bar-group')
      .data(dataset)
    .enter().append('g')
      .attr('class', 'bar-group')
      .style('fill', function(d, i) { return (isSingular ? '#368AC0' : charts.barColors(i)); })
      .style('stroke', function(d, i) { return (isSingular ? '#368AC0' : charts.barColors(i)); });

    // Add a rect for each
    stack.selectAll('rect')
      .data(Object)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return x(d.x) + spaceWidth; })
      .attr('width', barWidth)
      .attr('y', function(d) { return y(d.y0);})//(true ? 100 : y(d.y)); })
      .attr('height', function(d) {
        var h = -y(d.y0) - y(d.y);
        if (h < 0) {
          h = 0;
        }
        return h;
      })
      .transition().duration(1000)
        .attr('y', function(d) { return -y(d.y0) - y(d.y); })
        .attr('height', function(d) { return y(d.y); });

    //Attach Interactivity
    stack.selectAll('rect')
      .on('mouseenter', function (d, i) {

        var shape = $(this),
            content = '',
            xPos,
            yPos = d3.event.pageY-charts.tooltip.outerHeight() - 35;

        if (dataset.length === 1) {
          content = '<p><b>' + d.y + ' </b>' + d.x + '</p>';
        } else {
         content = '<div class="chart-swatch">';
         for (var j = 0; j < dataset.length; j++) {
          content += '<div style="background-color:'+(isSingular ? '#368AC0' : charts.barColors(j))+';"></div><span>' + series[j].name + '</span><b> ' + dataset[j][i].y + ' </b></br>';
         }
         content += '</div>';
        }

        var size = charts.getTooltipSize(content);
        xPos = shape.offset().left - (size.width /2) + (barWidth/2);

        charts.tooltip.css({'left': xPos + 'px', 'top': yPos+ 'px'})
            .find('.tooltip-content')
              .html(content);

        charts.tooltip.addClass('top').removeClass('right').removeClass('is-hidden');
      })
      .on('mouseleave', function () {
        charts.tooltip.addClass('is-hidden')
          .css({'left': '-999px' + 'px', 'top': '-999px' + 'px'});
      })
      .on('click', function (d, i) {
        var bar = d3.select(this);

        //Hide bold on label
        svg.selectAll('.label').style('font-weight', 'normal');
        svg.selectAll('.bar-group rect').style('opacity', 1);
        svg.selectAll('.is-selected').classed('is-selected', false);
        if (this.classList && !this.classList.contains('is-selected')) {
          bar.classed('is-selected', true);
          svg.selectAll('.label:nth-child('+ (i+1) +')').style('font-weight', 'bolder');
          svg.selectAll('.bar:not(.is-selected)').style('opacity', 0.5);
        }
        $(container).trigger('selected', [bar, d]);
      });

    //Add Legends
    charts.addLegend(series);
    charts.appendTooltip();
  };

  this.VerticalBar = function(dataset, isNormalized) {
    //Original http://jsfiddle.net/datashaman/rBfy5/2/
    var maxTextWidth, width, height, series, rects, svg, stack,
        xMax, xScale, yScale, yAxis, yMap, xAxis, groups;

    var margins = {
      top: 30,
      left: 48,
      right: 24,
      bottom: 30 // 30px plus size of the bottom axis (20)
    };

    $(container).addClass('chart-vertical-bar');
    $(container).closest('.widget-content').addClass('l-center');
    $(container).closest('.card-content').addClass('l-center');

    width = 376 + margins.left + margins.right ;
    height = 250 - margins.top - margins.bottom;  //influences the bar width

    //Get the Legend Series'
    series = dataset.map(function (d) {
      return {name: d.name};
    });

    //Map the Data Sets and Stack them.
    dataset = dataset.map(function (d) {
      return d.data.map(function (o) {
        // Structure it so that your numeric
        // axis (the stacked amount) is y
        return {
            y: o.value,
            x: o.name
        };
      });
    });
    stack = d3.layout.stack();
    stack(dataset);

    //Calculate max text width
    maxTextWidth = 0;

    dataset = dataset.map(function (group) {
      return group.map(function (d) {
        maxTextWidth = (d.x.length > maxTextWidth ? d.x.length : maxTextWidth);
        // Invert the x and y values, and y0 becomes x0
        return {
            x: d.y,
            y: d.x,
            x0: d.y0
        };
      });
    });

    margins.left += maxTextWidth*4.5;

    var h = height + margins.top + margins.bottom,
      w = width + margins.left + margins.right;

    svg = d3.select(container)
      .append('svg')
      .attr('width', w) //100%
      .attr('height', h)
      .attr('viewBox', '0 0 '+ w + ' ' + h)
      .attr('preserveAspectRatio','xMinYMin meet')
      .append('g')
      .attr('class', 'group')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');


    xMax = d3.max(dataset, function (group) {
      return d3.max(group, function (d) {
          return d.x + d.x0;
      });
    });

    if (isNormalized) {
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

    xScale = d3.scale.linear()
      .domain([0, xMax])
      .nice()
      .range([0, width]);

    yMap = dataset[0].map(function (d) {
      return d.y;
    });

    yScale = d3.scale.ordinal()
      .domain(yMap)
      .rangeRoundBands([0, height], 0.3, 0.10);

    xAxis = d3.svg.axis()
      .scale(xScale)
      .tickSize(-height)
      .tickPadding(10)
      .orient('bottom');

    if (isNormalized) {
      xAxis.tickFormat(function(d) { return d + '%'; });
    }

    yAxis = d3.svg.axis()
      .scale(yScale)
      .tickSize(0)
      .tickPadding(10)
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
        return charts.barColors(i);
      });

    rects = groups.selectAll('rect')
      .data(function (d) {
        return d;
    })
    .enter()
    .append('rect')
    .attr('class', function(d, i) {
      return 'series-'+i+' bar';
    })
    .attr('x', function (d) {
      return xScale(d.x0);
    })
    .attr('y', function (d) {
      return yScale(d.y);
    })
    .attr('height', function () {
      return yScale.rangeBand();
    })
    .attr('width', 0) //Animated in later
    .on('mouseenter', function (d, i) {
      var shape = d3.select(this),
            content = '',
            total = 0, totals = [];

       if (dataset.length === 1) {
          content = '<p><b>' + d.y + ' </b>' + d.x + '</p>';
        } else {
         content = '<div class="chart-swatch">';

         for (var j = 0; j < dataset.length; j++) {
          total = 0;

          for (var k = 0; k < dataset.length; k++) {
            total += dataset[k][i].x;
            totals[k] = dataset[k][i].x;
          }

          content += '<div style="background-color:'+charts.barColors(j)+';"></div><span>' + series[j].name + '</span><b> ' + Math.round((totals[j]/total)*100) + '% </b></br>';
         }
         content += '</div>';
        }

        if (total > 0) {
          content = '<span class="chart-tooltip-total"><b>' + total + '</b> '+Locale.translate('Total')+'</span>' +content;
        }

        // Set the position
        charts.tooltip.find('.tooltip-content').html(content);

        var yPosS = svg[0][0].getBoundingClientRect().top + $(window).scrollTop(),
            xPos = d3.event.pageX + 25,
            yPos = yPosS + parseFloat(shape.attr('y')) + 5 - (parseInt(charts.tooltip.outerHeight()) /2) + (parseFloat(shape.attr('height'))/2);

        charts.tooltip.css({'left': xPos + 'px', 'top': yPos+ 'px'});
        charts.tooltip.removeClass('is-hidden', false);

    })
    .on('mouseleave', function () {
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
        svg.selectAll('.bar:not(.series-' + i + ')').style('opacity', 0.5);
      }
      $(container).trigger('selected', [bar, d]);
    });

    //Animate the Bars In
    svg.selectAll('.bar')
      .transition().duration(1000)
      .attr('width', function (d) {
        return xScale(d.x);
      });

    function resizeVertBar() {
      var svgWidth = $(container).find('svg').width(),
          chartW = $(container).width(),
          currTicks, xScale, newTicks;

      if (chartW <= svgWidth) {

        var chartSvgDiff = svgWidth - chartW,
            squeezePercent = ( ( svgWidth - chartSvgDiff ) * 100 ) / svgWidth,
            scaleW = 0.01 * squeezePercent;

        currTicks = d3.svg.axis()
            .scale(xScale)
            .ticks();

        newTicks = Math.floor(currTicks / 2);

        // Redefine the X Scale
        xScale = d3.scale.linear()
          .domain([0, xMax])
          .nice()
          .range([0, (width * scaleW) - 50]);

        // Redefine the X Axis
        xAxis = d3.svg.axis()
          .scale(xScale)
          .ticks(newTicks)
          .tickSize(-height)
          .tickPadding(0);

        // Redraw the X Axis
        d3.select('.x')
          .call(xAxis);

        // Redraw the bars
        svg.selectAll('.bar')
          .transition()
          .duration(500)
          .attr('width', function (d) {
            return xScale(d.x);
          })
          .attr('x', function (d) {
            return xScale(d.x0);
          });

      } else{

        // Redefine the X Scale
        xScale = d3.scale.linear()
          .domain([0, xMax])
          .nice()
          .range([0, width]);

        // Redefine the X Axis
        xAxis = d3.svg.axis()
          .scale(xScale)
          .ticks(currTicks)
          .tickSize(-height);

        // Redraw the X Axis
        d3.select('.x')
          .call(xAxis);

        // Redraw the bars
        svg.selectAll('.bar')
          .transition()
          .duration(500)
          .attr('width', function (d) {
            return xScale(d.x);
          })
          .attr('x', function (d) {
            return xScale(d.x0);
          });
      }
    }

    $(window).off('resize.charts load.charts')
        .on('resize.charts load.charts', resizeVertBar);

    //Add Legends
    charts.addLegend(series);
    charts.appendTooltip();
    return $(container);
  };

  this.Pie = function(initialData, isDonut) {

    var svg = d3.select(container).append('svg'),
      arcs = svg.append('g').attr('class','arcs'),
      labels = svg.append('g').attr('class','labels'),
      centerLabel = initialData[0].centerLabel;

    var chartData = initialData[0].data;
    $(container).addClass('chart-pie');

    // Create the pie layout function.
    var pie = d3.layout.pie().value(function (d) {
      // what property of our data object to use
      return d.value;
    });

    // Store our chart dimensions
    var dims = {
      height: parseInt($(container).parent().height()),  //header + 20 px padding
      width: parseInt($(container).parent().width())
    };

    dims.outerRadius = ((Math.min(dims.width, dims.height) / 2) - (isDonut ? 20 : 50));
    dims.innerRadius = isDonut ? dims.outerRadius - 30 : 0;
    dims.labelRadius = dims.outerRadius + 11;

    svg.attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox','0 0 ' + dims.width + ' ' + dims.height);
      //.attr('preserveAspectRatio','xMaxYMax');
      //http://git.infor.com/projects/SOHO/repos/controls/commits/e796f46c0ad00f92c67b6eb87ac64a3d83ee2e25

    // move the origin of the group's coordinate space to the center of the SVG element
    arcs.attr('transform', 'translate(' + (dims.width / 2) + ',' + ((dims.height / 2) + (isDonut ? 0 : 15))  + ')');
    labels.attr('transform', 'translate(' + (dims.width / 2) + ',' + ((dims.height / 2) + (isDonut ? 0 : 15)) + ')');

    var pieData = pie(chartData);

    // calculate the path information for each wedge
    var pieArcs = d3.svg.arc()
        .innerRadius(dims.innerRadius)
        .outerRadius(dims.outerRadius);

    // Draw the arcs.
    var enteringArcs = arcs.selectAll('.arc').data(pieData).enter();

    var g = enteringArcs.append('g')
        .attr('class', 'arc')
        .attr('d', pieArcs)
        .on('click', function (d, i) {

          var color = charts.pieColors(i);
          d3.select('.chart-container .is-selected')
            .classed('is-selected', false)
            .style('stroke', '#fff')
            .style('stroke-width', '1px')
            .attr('transform', '');

          var path = d3.select(this)
              .classed('is-selected', true)
              .style('stroke', color)
              .style('stroke-width', 0)
              .attr('transform', 'scale(1.025, 1.025)');

          $(container).trigger('selected', [path[0], d]);
        });

    g.append('path')
      .style('fill', function(d, i) { return charts.pieColors(i); })
      .transition().duration(750)
      .attrTween('d', function(d) {
        var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
       return function(t) {
           d.endAngle = i(t);
           return pieArcs(d);
         };
      });

    // Now we'll draw our label lines, etc.
    var enteringLabels = labels.selectAll('.label').data(pieData).enter();
    var labelGroups = enteringLabels.append('g').attr('class', 'label');
    labelGroups.append('circle').attr({
        x: 0,
        y: 0,
        r: 2,
        fill: '#000000',
        transform: function (d) {
          var x = pieArcs.centroid(d)[0],
            y = pieArcs.centroid(d)[1];

          return 'translate(' + x + ',' + y + ')';
        },
        'class': 'label-circle'
    });

    var textLines = labelGroups.append('line').attr({
        x1: function (d) {
          return pieArcs.centroid(d)[0];
        },
        y1: function (d) {
          return pieArcs.centroid(d)[1];
        },
        x2: function (d) {
          var centroid = pieArcs.centroid(d),
            midAngle = Math.atan2(centroid[1], centroid[0]),
            x = Math.cos(midAngle) * dims.labelRadius;
          return x;
        },
        y2: function (d) {
          var centroid = pieArcs.centroid(d),
           midAngle = Math.atan2(centroid[1], centroid[0]),
           y = Math.sin(midAngle) * dims.labelRadius;

          return y;
        },
        'class': 'label-line'
    });

    var total = d3.sum(chartData, function(d){ return d.value; });
    var textLabels = labelGroups.append('text').attr({
        x: function (d) {
          var centroid = pieArcs.centroid(d),
            midAngle = Math.atan2(centroid[1], centroid[0]),
            x = Math.cos(midAngle) * dims.labelRadius,
            sign = (x > 0) ? 1 : -1,
            labelX = x + (1 * sign);

          return labelX;
        },
        y: function (d) {
          var centroid = pieArcs.centroid(d),
            midAngle = Math.atan2(centroid[1], centroid[0]),
            y = Math.sin(midAngle) * dims.labelRadius;

          return (y);
        },
        'text-anchor': function (d) {
          var centroid = pieArcs.centroid(d),
           midAngle = Math.atan2(centroid[1], centroid[0]),
            x = Math.cos(midAngle) * dims.labelRadius;

          return (x > 0) ? 'start' : 'end';
        },
        'class': 'label-text'
    }).text(function (d) {
      return d.data.name;
    });

    textLabels.append('tspan').text(function(d) {
      return d3.round(100*(d.value/total)) + '%';
    })
    .attr('dx', '-50')
    .attr('dy', '-20px')
    .style('font-weight', 'bold')
    .style('font-size', '22px')
    .style('fill', function (d, i) {
      return charts.pieColors(i);
    });

    if (isDonut) {
      arcs.append('text')
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .attr('class', 'chart-donut-text')
      .text(centerLabel);
    }

    //Calculate Percents for Legend
    chartData.map(function (d, i) {
        d.percent = d3.round(100*(d.value/total)) + '%';
        d.elem = enteringArcs[0][i];

        if (parseInt(d.percent) > 10) {
          d3.select(textLines[0][i]).style('stroke', 'transparent');
          d3.select(labelGroups[0][i]).select('circle').style('fill', 'transparent');
        }
        return {name: d.name, percent: d.percent, elem: d.elem};
      });

    var alpha = 0.5,
    spacing = 50;

    function relax() {
      var again = false;
      textLabels.each(function () {
          var a = this,
            da = d3.select(this),
            y1 = da.attr('y');

      textLabels.each(function () {
            var b = this;
            // a & b are the same element and don't collide.
            if (a === b) {
              return;
            }
            var db = d3.select(this);

            // a & b are on opposite sides of the chart and don't collide
            if (da.attr('text-anchor') !== db.attr('text-anchor')) {
              return;
            }

            // calculate the distance between these elements.
            var y2 = db.attr('y'),
              deltaY = y1 - y2;

            // they don't collide.
            if (Math.abs(deltaY) > spacing) {
              return;
            }

            // If the labels collide, we'll push each of the two labels up and down
            again = true;
            var sign = deltaY > 0 ? 1 : -1,
              adjust = sign * alpha;

            da.attr('y',+y1 + adjust);
            db.attr('y',+y2 - adjust);
        });
      });

      // Adjust our line leaders
      if (again) {
        var labelElements = textLabels[0];
        textLines.attr('y2',function(d,i) {
          var labelForLine = d3.select(labelElements[i]);
          return labelForLine.attr('y');
        });
        relax();
      }
    }

    relax();
    var timeout;

    //Handle Resize / Redraw
    function resizePie() {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        $(container).empty();
        charts.Pie(initialData, isDonut);
      }, 100);
    }

    $(window).off('resize.pie').on('resize.pie', resizePie);

    return $(container);
  };

  // Donut Chart - Same as Pie but inner radius
  this.Ring = function(chartData) {
    return charts.Pie(chartData, true);
  };

  // Column Chart - Sames as bar but reverse axis
  this.Column = function(chartData) {
    return charts.Bar(chartData, true);
  };

  this.Sparkline = function(chartData) {
     // calculate max and min values in the NLWest data
    var max=0, min=0, len=0, i;

    for (i = 0; i < chartData.length; i++) {
      min = d3.min([d3.min(chartData[i].data), min]);
      max = d3.max([d3.max(chartData[i].data), max]);
      len = d3.max([chartData[i].data.length, len]);
    }

    var h = 60,
      w = 250,
      p = 10,
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

    for (i = 0; i < chartData.length; i++) {
      var set = chartData[i],
        g = svg.append('g');
        g.append('path')
         .attr('d', line(set.data))
         .attr('stroke', charts.greyColors(i))
         .attr('class', 'team');
    }

    //Add Peak Dot
    svg.selectAll('.point')
      .data(chartData[0].data)
    .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', function(d, i) { return x(i); })
      .attr('cy', function(d) { return y(d); })
      .style('fill', '#786186')
      .style('stroke', '#f86f11')
      .attr('r', function(d) {
        // Could do: First and Last (i === (data.length - 1) || i === 0)
        // But instead we show max
        return (max === d) ? 4 : 0;
      }).on('mouseenter', function(d) {
        var rect = d3.select(this)[0][0].getBoundingClientRect(),
          content = '<p>' + (chartData[0].name ? chartData[0].name + '<br> '+ Locale.translate('Peak') +': ': '') + '<b>' + d  + '</b></p>',
          size = charts.getTooltipSize(content),
          x = rect.x - (size.width /2) + 6,
          y = rect.y - size.height - 18;

        charts.showTooltip(x, y, content, 'top');
      }).on('mouseleave', function() {
        charts.hideTooltip();
      });
  };
};

//Make it a plugin
$.fn.chart = function(options) {
  return this.each(function() {
    var instance = $.data(this, 'chart'),
      chartInst;

    if (instance) {
      $(window).off('resize.pie');
      $(window).off('resize.charts load.charts');
      $(this).empty();
    }

    chartInst = new Chart(this, options);
    instance = $.data(this, 'chart', chartInst);

    if ($.isEmptyObject(chartInst)) {
     return;
    }
    if (options.type === 'pie') {
      chartInst.Pie(options.dataset);
    }
    if (options.type === 'bar') {
      chartInst.VerticalBar(options.dataset);
    }
    if (options.type === 'bar-normalized') {
      chartInst.VerticalBar(options.dataset, true);
    }
    if (options.type === 'bar-grouped') {
      chartInst.VerticalBar(options.dataset, false, true);
    }
    if (options.type === 'column') {
      chartInst.Bar(options.dataset, false, true);
    }
    if (options.type === 'donut') {
      chartInst.Pie(options.dataset, true);
    }
    if (options.type === 'sparkline') {
      chartInst.Sparkline(options.dataset);
    }

  });
};


