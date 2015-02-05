/**
* Chart Controls
* @name Charts
* TODO:

  Make vertical bar chart (have horizontal)
  Work on update functions or routine
  Make responsive
  Make Area/Dot Chart
  IE8 Fallbacks
  Test With Screen readers
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function () {

  window.Chart = function(container) {
    var charts = this;

    //IE8 and Below Message
    if (typeof d3 === 'undefined') {
      //TODO - Localize and Check Text
      $(container).append('<p class="chart-message">This content is not available because it uses SVG features not supported in your current browser version. Please try Chrome, Firefox, Safari or IE9+</p>');
      return null;
    }
    this.options = {
      colorRange: ['#13a7ff', '#0872b0', '#79cc26', '#3f9818', '#ffd042',
          '#f86f11', '#97d8ff', '#96e345', '#d79df4', '#f57294', '#bdbdbd',
          '#164203', '#03a59a', '#660a23', '#5a187a', '#454545', '#004d47', '#ff4249'], //Shared Options
    };

    this.colors = d3.scale.ordinal().range(charts.options.colorRange);

    // Function to Add a Legend - TODO Remove unused params
    this.addLegend = function(series, position) {
      //var legend = svg.append('g').attr('transform', 'translate(' + margins.left + ',' + (position === 'right' ? -(height/2)+20 : (height + margins.bottom)) +')');
      var legend = $('<div class="chart-legend"></div>');
      if (series.length === 0) {
        return;
      }

      for (var i = 0; i < series.length; i++) {
        if (!series[i].name) {
          continue;
        }

        var seriesLine = $('<span class="chart-legend-item" tabindex="0"></span>'),
          color = $('<div class="chart-legend-color"></div>').css('background-color', charts.colors(i)),
          text = $('<span>'+ series[i].name  + '</span>');

        if (series[i].percent) {
          var pct = $('<span class="chart-legend-percent"></span>').text(series[i].percent);
          text.append(pct);
        }

        seriesLine.append(color, text);
        legend.append(seriesLine);
      }

      legend.on('click.chart focus.chart', '.chart-legend-item', function () {
        var idx = $(this).index();

        // trigger the click event
        var e = document.createEvent('UIEvents');
        e.initUIEvent('click', true, true, window, 1);
        if (series[idx].elem) {
          series[idx].elem.dispatchEvent(e);
        }
      });

      if (position === 'below') {
        legend.addClass('is-below');
      }
      $(container).append(legend);

    };

    //Add Toolbar to the page
    this.appendTooltip = function() {
      this.tooltip = $('#svg-tooltip');
      if (this.tooltip.length === 0) {
        this.tooltip = $('<div id="svg-tooltip" class="tooltip right is-hidden"><div class="arrow"></div><div class="tooltip-content"><p><b>32</b> Element</p></div></div>').appendTo('body');
      }
    };

    this.Bar = function(dataset) {
      var margins = {
        top: 20,
        left: 50,
        right: 20,
        bottom: 5
      };

      var w = 480,
        h = 300,
        barWidth = 24,
        spaceWidth = 10,
        y,
        stack,
        x = d3.scale.ordinal().rangeRoundBands([0, w - margins.left - margins.right]);

      var svg = d3.select(container).append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate(' + (margins.left) + ',' + (h - margins.top) + ')');

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
        .style('fill', function(d, i) { return charts.colors(i); })
        .style('stroke', function(d, i) { return charts.colors(i); });

      // Add a rect for each
      stack.selectAll('rect')
        .data(Object)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.x) + spaceWidth; })
        .attr('width', barWidth)
        .attr('y', function(d) { return y(d.y); })
        .attr('height', function(d) { return -y(d.y0) - y(d.y); })
        .transition().duration(1000)
          .attr('y', function(d) { return -y(d.y0) - y(d.y); })
          .attr('height', function(d) { return y(d.y); });

      //Attach Interactivity
      stack.selectAll('rect')
        .on('mouseenter', function (d, i) {

          var shape = d3.select(this),
              content = '',
              xPos = parseFloat(shape.attr('x')) + margins.left - (charts.tooltip.outerWidth()/2) + barWidth/2,
              yPos = d3.event.pageY-charts.tooltip.outerHeight() - 35;

          if (dataset.length === 1) {
            content = '<p><b>' + d.y + ' </b>' + d.x + '</p>';
          } else {
           content = '<div class="chart-swatch">';
           for (var j = 0; j < dataset.length; j++) {
            content += '<div style="background-color:'+charts.colors(j)+';"></div><span>' + series[j].name + '</span><b> ' + dataset[j][i].y + ' </b></br>';
           }
           content += '</div>';
          }
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

          d3.selectAll('.bar-group rect').style('opacity', 1);
          d3.selectAll('.is-selected').classed('is-selected', false);
          if (!this.classList.contains('is-selected')) {
            bar.classed('is-selected', true);
            svg.selectAll('.label:nth-child('+ (i+1) +')').style('font-weight', 'bolder');
            d3.selectAll('.bar:not(.is-selected)').style('opacity', 0.5);
          }
          $(container).trigger('selected', [bar, d]);
        });

      //Add Legends
      charts.addLegend(series);
      charts.appendTooltip();
    };

    charts.VerticalBar = function(dataset, isNormalized) {
      //Original http://jsfiddle.net/datashaman/rBfy5/2/
      var maxTextWidth, width, height, series, rects, svg, stack,
          xMax, xScale, yScale, yAxis, yMap, xAxis, groups;

      var margins = {
        top: 30,
        left: 48,
        right: 24,
        bottom: 30 // 30px plus size of the bottom axis (20)
      };

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
        .attr('preserveAspectRatio', 'xMinYMax meet')
        .attr('viewBox', '0 0 '+ w + ' ' + h)
        .attr('width', w)
        .attr('height', h)
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
          return charts.colors(i);
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

            content += '<div style="background-color:'+charts.colors(j)+';"></div><span>' + series[j].name + '</span><b> ' + Math.round((totals[j]/total)*100) + '% </b></br>';
           }
           content += '</div>';
          }

          //TODO: Localize
          if (total > 0) {
            content = '<span class="chart-tooltip-total"><b>' + total + '</b> Total</span>' +content;
          }

          // Set the position
          charts.tooltip.find('.tooltip-content').html(content);

          var yPosS = svg[0][0].getBoundingClientRect().top,
              xPos = d3.event.pageX + 25,
              yPos = yPosS + parseFloat(shape.attr('y')) + 5 - (parseInt(charts.tooltip.outerHeight()) /2) + (parseFloat(shape.attr('height'))/2);

          charts.tooltip.css({'left': xPos + 'px', 'top': yPos+ 'px'});

        //charts.tooltip.addClass('top').removeClass('right').removeClass('is-hidden');
        charts.tooltip.removeClass('is-hidden', false);
      })
      .on('mouseleave', function () {
        d3.select('#svg-tooltip').classed('is-hidden', true).style('left', '-999px');
      })
      .on('click', function (d, i) {
        var bar = d3.select(this);

        d3.selectAll('.axis.y .tick').style('font-weight', 'normal');
        d3.selectAll('.bar').style('opacity', 1);
        if (this.classList.contains('is-selected')) {
          d3.selectAll('.is-selected').classed('is-selected', false);
        } else {
          d3.selectAll('.is-selected').classed('is-selected', false);
          bar.classed('is-selected', true);
          d3.selectAll('.axis.y .tick:nth-child('+ (i+1) +')').style('font-weight', 'bolder');
          d3.selectAll('.bar:not(.series-' + i + ')').style('opacity', 0.5);
        }
        $(container).trigger('selected', [bar, d]);
      });

      //Animate the Bars In
      svg.selectAll('.bar')
        .transition().duration(1000)
        .attr('width', function (d) {
          return xScale(d.x);
        });


      //TODO: Link Click Event to the legend
      /*
      svg.selectAll('.series-group')
      .each(function(d,i) {
        series[i].elem = d3.select(this).select('rect')[0][];
      });
      */

      //Add Legends
      charts.addLegend(series, 'below');
      charts.appendTooltip();
      return $(container);
    };

    charts.Pie = function(chartData, isDonut) {
      var centerLabel = chartData[0].centerLabel;
      chartData = chartData[0].data;
      var radius, svg, margin, arc, width, height;

      margin = {top: 20, right: 20, bottom: 20, left: 20};
      width = 320 - margin.left - margin.right;
      height = width - margin.top - margin.bottom;

      svg = d3.select(container)
              .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
               .append('g')
                .attr('class', 'pie')
                .attr('transform', 'translate(' + ((width/2)+margin.left) + ',' + ((height/2)+margin.top) + ')');

      radius = Math.min(width, height) / 2;

      arc = d3.svg.arc().outerRadius(radius);

      if (isDonut) {
        arc.innerRadius(radius - 20);
      }

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d.value; });

      var g = svg.selectAll('.arc')
                .data(pie(chartData))
              .enter().append('g')
                .attr('class', 'arc')
                .on('mousemove', function (d) {
                    var tooltip = d3.select('#svg-tooltip');

                    tooltip.style('left', d3.event.pageX + 20 + 'px')
                      .style('top', d3.event.pageY-margin.top-20 + 'px')
                      .select('.tooltip-content')
                      .html('<p>' + d.data.name + '<b> ' + d.data.percent + '</b></p>');

                    tooltip.classed('is-hidden', false);
                })
                .on('mouseleave', function () {
                    d3.select('#svg-tooltip').classed('is-hidden', true).style('left', '-999px');
                })
                .on('click', function (d, i) {
                  var color = charts.colors(i);
                  d3.select('.is-selected')
                    .classed('is-selected', false)
                    .style('stroke', '#fff')
                    .style('stroke-width', '1px')
                    .attr('transform', '');

                  var path = d3.select(this).select('path')
                      .classed('is-selected', true)
                      .style('stroke', color)
                      .style('stroke-width', 0)
                      .attr('transform', 'scale(1.045,1.045)');

                  $(container).trigger('selected', [path[0], d]);
                });

      g.append('path')
        .style('fill', function(d, i) { return charts.colors(i); })
        .transition().duration(750)
        .attrTween('d', function(d) {
             var i = d3.interpolate(d.startAngle, d.endAngle);
             return function(t) {
                 d.endAngle = i(t);
               return arc(d);
             };
        });

      //Calculate Percents for Legend
      var total = d3.sum(chartData, function(d){return d.value;}),
        series = chartData.map(function (d, i) {
          d.percent = d3.round(100*(d.value/total)) + '%';
          d.elem = g[0][i];
          return {name: d.name, percent:d.percent, elem: d.elem};
        });

      charts.addLegend(series);
      charts.appendTooltip();

      if (isDonut) {
        svg.append('text')
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .attr('class', 'chart-donut-text')
        .text(centerLabel);
      }
      return $(container);
    };

    /* Donut Chart - Same as Pie but inner radius */
    charts.Ring = function(chartData) {
      return charts.Pie(chartData, true);
    };

    /* Column Chart - Sames as bar but reverse axis */
    charts.Column = function(chartData) {
      return charts.Bar(chartData, true);
    };
  };

  //Make it a plugin
  $.fn.chart = function(options) {
    return this.each(function() {
      var instance = $.data(this, 'chart'),
        chartInst;

      if (instance) {
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

}));
