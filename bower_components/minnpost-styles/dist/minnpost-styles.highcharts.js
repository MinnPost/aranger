/**
 * Stylings for Highcharts
 */

(function(global, factory) {
  // Common JS (i.e. browserify) environment
  if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    module.exports = factory(require('jquery'), require('highcharts'));
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
    define(['jquery', 'highcharts'], factory);
  }
  // Browser global
  else if (global.jQuery && global.Highcharts) {
    global.MP = global.MP || {};
    global.MP.highcharts = factory(global.jQuery, global.Highcharts);
  }
  else {
    throw new Error('Could not find dependencies for MinnPost Styles Highchart.' );
  }
})(typeof window !== 'undefined' ? window : this, function($, Highcharts) {

  // Placeholder for highcharts stuff
  var highcharts = {};

  // A wrapper to make highchart with selector and
  // return the highcharts object
  highcharts.makeChart = function(selector, options) {
    var chart = $(selector).highcharts(options);
    return chart.highcharts();
  };

  // Common styles.  It seems that Highcharts wants this all
  // repeated
  highcharts.colorDark = '#676767';
  highcharts.colorLight = '#BCBCBC';
  highcharts.colorLighter = 'DEDEDE';
  highcharts.font = '"Open Sans", Helvetica, Arial, "Lucida Grande", sans-serif';
  highcharts.styleGeneral = {
    fontFamily: highcharts.font,
    fontSize: '12px',
    fontWeight: 'normal',
    color: highcharts.colorLight
  };
  highcharts.styleLabel = $.extend({}, highcharts.styleGeneral, {
    fontWeight: 'bold',
    color: highcharts.colorDark
  });
  highcharts.styleLabelLarge = $.extend({}, highcharts.styleGeneral, {
    fontSize: '14px',
    fontWeight: 'bold',
    color: highcharts.colorDark
  });
  highcharts.styleTooltip = $.extend({}, highcharts.styleGeneral, {
    color: highcharts.colorDark
  });
  highcharts.styleLight = $.extend({}, highcharts.styleGeneral, {
    color: highcharts.colorLighter
  });

  // TODO: align legend left (can't find a way to do this)
  // Common defauls
  highcharts.defaults = {
    chart: {
      style: highcharts.styleGeneral
    },
    colors: ['#0D57A0', '#0793AB', '#55CBDD'],
    credits: {
      enabled: false
    },
    title: {
      enabled: false,
      text: null
    },
    legend: {
      margin: 30,
      verticalAlign: 'top',
      borderWidth: 0,
      itemDistance: 20,
      itemStyle: highcharts.styleLabelLarge
    },
    xAxis: {
      title: {
        enabled: false,
        text: 'Units (un)',
        margin: 20,
        style: highcharts.styleLabel
      },
      lineColor: highcharts.colorLight,
      tickColor: highcharts.colorLight,
      labels: {
        y: 18
        // http://docs.highcharts.com/docs/chart-concepts/labels-and-string-formatting/
        //format: '${value}'
        // Use this for something more complicated
        /*
        formatter: function() {
          return this.value;
        }
        */
      }
    },
    yAxis: {
      title: {
        enabled: true,
        text: 'Units (un)',
        margin: 20,
        style: highcharts.styleLabel
      },
      min: 0,
      lineColor: highcharts.colorLighter,
      gridLineDashStyle: 'Dot'
    },
    tooltip: {
      //shadow: false,
      //borderRadius: 0,
      //borderWidth: 0,
      style: highcharts.styleTooltip,
      useHTML: true,
      formatter: function() {
        return '<strong>' + this.series.name + '</strong>: ' + Highcharts.numberFormat(this.y, 0);
      }
    }
  };

  // Line charts defaults
  highcharts.lineOptions = $.extend(true, {}, highcharts.defaults, {
    chart: {
      type: 'line'
    },
    plotOptions: {
      line: {
        lineWidth: 4,
        states: {
          hover: {
            lineWidth: 5
          }
        },
        marker: {
          fillColor: '#FFFFFF',
          lineWidth: 2,
          lineColor: null,
          symbol: 'circle',
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    }
  });

  // Column charts defaults
  highcharts.columnOptions = $.extend(true, {}, highcharts.defaults, {
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        minPointLength: 3
      }
    }
  });

  // Bar charts defaults
  highcharts.barOptions = $.extend(true, {}, highcharts.defaults, {
    chart: {
      type: 'bar'
    },
    plotOptions: {
      bar: {
        minPointLength: 3
      }
    },
    xAxis: {
      labels: {
        y: 0
      }
    }
  });

  // Scatter plot
  highcharts.scatterOptions = $.extend(true, {}, highcharts.defaults, {
    chart: {
      type: 'scatter'
    },
    xAxis: {
      title: {
        enabled: true
      }
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          lineWidth: 2,
          lineColor: 'rgba(255, 255, 255, 0.2)',
          hover: {
            lineColor: 'rgba(255, 255, 255, 1)'
          }
        }
      }
    },
    tooltip: {
      formatter: function() {
        return '<strong>' + this.series.name + '</strong>: (' + this.x + ', ' + this.y + ')';
      }
    }
  });

  return highcharts;
});
