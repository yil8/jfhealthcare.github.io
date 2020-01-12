(function ($, d3) {
  'use strict'

  $.widget('.ecgChart', {
    options: {
      margin: {
        top: 0,
        right: 1,
        bottom: 1,
        left: 0
      },
      height: $('.ecgChart').width() / 1.6,
      width: $('.ecgChart').width(),
      xMin: 0,
      xMax: 3e3,
      xMajorTicks: 1e3,
      yMin: -10,
      yMax: 10
    },
    _create: function () {
      var a = this
      a.data = []
      a.svg = d3
        .select(a.element[0])
        .append('svg')
        .attr('height', a.options.height)
        .attr('width', a.options.width)
      a.options.height = a.options.height - a.options.margin.top - a.options.margin.bottom
      a.options.width = a.options.width - a.options.margin.left - a.options.margin.right
      a.canvas = a.svg.append('g')
        .attr('transform', 'translate(' + (a.options.margin.left + 0.5) + ',' + (a.options.margin.top + 0.5) + ')')
      a.canvas.call(function (b) {
        a.background = b.append('rect')
                .classed('ecgChart-background', !0)
                .attr('height', a.options.height)
                .attr('width', a.options.width)
                .attr('x', 0)
                .attr('y', 0)
      })
      a.yScale = d3.scale.linear()
            .domain([a.options.yMax, a.options.yMin])
            .range([0, a.options.height])
      a.xScale = d3.scale.linear()
            .domain([a.options.xMin, a.options.xMax])
            .range([0, a.options.width])
      a.yAxisGenerator = d3.svg.axis()
                .scale(a.yScale).orient('left')
                .ticks(4).tickFormat('')
      a.yAxis = a.canvas.append('g').classed('ecgChart-axis-y', !0).call(a.yAxisGenerator)
      a.yGridGenerator = d3.svg.axis()
                .scale(a.yScale).orient('left')
                .ticks(4).tickSize(-a.options.width)
                .tickFormat('')
      a.yGrid = a.canvas.append('g')
                .classed('ecgChart-grid-y', !0)
                .call(a.yGridGenerator)
      a.xAxisGenerator = d3.svg.axis()
                .scale(a.xScale).orient('bottom')
                .ticks(this.options.xMax / this.options.xMajorTicks)
                .tickFormat('')
      a.xAxis = a.canvas.append('g')
                .classed('ecgChart-axis-x', !0)
                .attr('transform', 'translate(0,' + a.options.height + ')')
                .call(a.xAxisGenerator)
      a.xGridGenerator = d3.svg.axis()
                .scale(a.xScale).orient('top')
                .ticks(this.options.xMax / this.options.xMajorTicks)
                .tickSize(-a.options.height).tickFormat('')
      a.xGrid = a.canvas.append('g')
                .classed('ecgChart-grid-x', !0)
                .call(a.xGridGenerator)
      a.lineGenerator = d3.svg.line().interpolate('cardinal')
        .x(function (b) {
          return a.xScale(b.x)
        }).y(function (b) {
          return a.yScale(b.y)
        })
      a.line = a.canvas.append('g')
                .append('path').datum(a.data)
                .classed('ecgChart-line', !0)
                .attr('d', a.lineGenerator)
      a.textLabel = a.canvas.append('text')
        .attr('font-size', '1em')
        .attr('font-family', 'sans-serif')
        .attr('stroke-width', '0px')
        .attr('text-anchor', 'left')
        .attr('x', 12.5)
        .attr('y', 15)
        .attr('dy', 10)

      a.point = a.canvas.append('circle')
        .attr('r', 4)
        .attr('opacity', 0.7)

      a.color = function (n) {
        var colores_g = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac']
        return colores_g[n % colores_g.length]
      }
    },
    _destroy: function () {
      this.element.remove('svg')
    },
    _redraw: function () {
      var a = this
      a.line.attr('d', function (d) {
        return a.lineGenerator(d)
      })
      .attr('stroke', function (d) { return a.color(d[d.length - 1].z) })
      .attr('stroke-width', 2)

      a.point.attr('cx', function () {
        return a.xScale(a.data[a.data.length - 1].x)
      })
      .attr('cy', function () {
        return a.yScale(a.data[a.data.length - 1].y)
      })
      a.textLabel.text(a.label_interpret)
      .attr('fill', function () { return a.color(a.data[a.data.length - 1].z) })
    },
    addDataPoint: function (point) {
      var a = this
      var c = {
        x: point.x % this.options.xMax,
        y: point.y,
        z: point.z
      }
      a.label_interpret = window.data.labels[c.z]
      a.lastX && a.lastX > c.x && (a.data.length = 0)
      a.lastX = c.x
      a.data.push(c)
      this._redraw()
    }
  })
})($, d3)
