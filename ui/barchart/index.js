
var d3 = require('d3');
var exports = module.exports;


exports.init = function(model, dom) {
}

exports.create = function(model, dom) {
  var mybar = bar()
  mybar.xValue(function(d) { return d.x; });
  mybar.yValue(function(d) { return d.y; });
  
  mybar.width(model.get('width'))
  mybar.height(model.get('height'))
  
  var el = dom.element('container');
  var data = model.get('data');
  d3.select(el).datum(data)
    .call(mybar)
    
  model.on("set", "data.*", function(data) {
   var data = model.get('data');
    d3.select(el).datum(data)
      .call(mybar)
  })
}


function bar() {
  // basic data
  var margin = {top: 10, bottom: 20, left: 0, right: 0},
      width = 400,
      height = 400,
      // accessors
      xValue = function(d) { return d.x; },
      yValue = function(d) { return d.y; },
      // chart underpinnings
      brush = d3.svg.brush(),
      xAxis = d3.svg.axis().orient('bottom'),
      yAxis = d3.svg.axis().orient('left'),
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      // chart enhancements
      elastic = {
        margin: true,
        x: true,
        y: true
      },
      convertData = true,
      duration = 500,
      formatNumber = d3.format(',d');

  function render(selection) {
    selection.each(function(data) {
      // setup the basics
      if (elastic.margin) margin.left = formatNumber(d3.max(data, function(d) { return d.y; })).length * 13;
      var w = width - margin.left - margin.right,
          h = height - margin.top - margin.bottom;

      // if needed convert the data
      if (convertData) {
        data = data.map(function(d, i) {
          return {
            x: xValue.call(data, d, i),
            y: yValue.call(data, d, i)
          };
        });
      }

      // set scales
      if (elastic.x) x.domain(data.map(function(d) { return d.x; }));
      if (elastic.y) y.domain([0, d3.max(data, function(d) { return d.y; })]);
      x.rangeRoundBands([0, w], .1);
      y.range([h, 0]);


      // reset axes and brush
      xAxis.scale(x);
      yAxis.scale(y);
      brush.x(x)
          .on('brushstart.chart', brushstart)
          .on('brush.chart', brushmove)
          .on('brushend.chart', brushend);
      brush.clear();

      var svg = selection.selectAll('svg').data([data]),
          chartEnter = svg.enter().append('svg')
                                    .attr('width', w + margin.left + margin.right)
                                    .attr('height', h + margin.top + margin.bottom)
                                  .append('g')
                                    .attr('width', w)
                                    .attr('height', h)
                                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                                    .classed('chart', true),
          chart = svg.select('.chart');

      chartEnter.append('g')
                .classed('x axis', true)
                .attr('transform', 'translate(' + 0 + ',' + h + ')');
      chartEnter.append('g')
                .classed('y axis', true)
      chartEnter.append('g').classed('barGroup', true);
      
      chart.selectAll('.brush').remove();
      chart.selectAll('.selected').classed('selected', false);
      
      chart.append('g')
                .classed('brush', true)
                .call(brush)
              .selectAll('rect')
                .attr('height', h);

      bars = chart.select('.barGroup').selectAll('.bar').data(data);

      bars.enter()
            .append('rect')
              .classed('bar', true)
              .attr('x', w) // start here for object constancy
              .attr('width', x.rangeBand())
              .attr('y', function(d, i) { return y(d.y); })
              .attr('height', function(d, i) { return h - y(d.y); });

      bars.transition()
            .duration(duration)
              .style('opacity', 1) // quick fix for exit problem
              .attr('width', x.rangeBand())
              .attr('x', function(d, i) { return x(d.x); })
              .attr('y', function(d, i) { return y(d.y); })
              .attr('height', function(d, i) { return h - y(d.y); });

      bars.exit()
            .transition()
                .duration(duration)
                    .style('opacity', 0)
                    .remove();

      chart.select('.x.axis')
            .transition()
                .duration(duration)
                  .call(xAxis);
      chart.select('.y.axis')
            .transition()
                .duration(duration)
                  .call(yAxis);  

      function brushstart() {
        chart.classed("selecting", true);
      }

      function brushmove() {
        var extent = d3.event.target.extent();
        bars.classed("selected", function(d) { return extent[0] <= x(d.x) && x(d.x) + x.rangeBand() <= extent[1]; });
      }

      function brushend() {
        chart.classed("selecting", !d3.event.target.empty());
      } 
    });
  }

  // basic data
  render.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return render;
  };
  render.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return render;
  };
  render.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return render;
  };

  // accessors
  render.xValue = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return render;
  };
  render.yValue = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return render;
  };

  // chart underpinnings
  render.brush = function(_) {
    if (!arguments.length) return brush;
    brush = _;
    return render;
  };
  render.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return render;
  };
  render.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return render;
  };
  render.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return render;
  };
  render.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return render;
  };
  
  // chart enhancements
  render.elastic = function(_) {
    if (!arguments.length) return elastic;
    elastic = _;
    return render;
  };
  render.convertData = function(_) {
    if (!arguments.length) return convertData;
    convertData = _;
    return render;
  };
  render.duration = function(_) {
    if (!arguments.length) return duration;
    duration = _;
    return render;
  };
  render.formatNumber = function(_) {
    if (!arguments.length) return formatNumber;
    formatNumber = _;
    return render;
  };

  return d3.rebind(render, brush, 'on');
};
