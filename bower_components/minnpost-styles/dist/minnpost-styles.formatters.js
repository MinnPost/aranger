/**
 * Formatters
 */

(function(global, factory) {
  // Common JS (i.e. browserify) environment
  if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    module.exports = factory(require('underscore'));
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
    define(['underscore'], factory);
  }
  // Browser global
  else if (global._) {
    global.MP = global.MP || {};
    global.MP.formatters = factory(global._);
  }
  else {
    throw new Error('Could not find dependencies for MinnPost Styles Formatters.' );
  }
})(typeof window !== 'undefined' ? window : this, function(_) {

  // Placeholder for formatters stuff
  var formatters = {};

  // Format number
  formatters.number = function(num, decimals) {
    decimals = (decimals || decimals === 0) ? decimals : 2;
    var rgx = (/(\d+)(\d{3})/);
    split = num.toFixed(decimals).toString().split('.');

    while (rgx.test(split[0])) {
      split[0] = split[0].replace(rgx, '$1' + ',' + '$2');
    }
    return (decimals) ? split[0] + '.' + split[1] : split[0];
  };

  // Format integer
  formatters.integer = function(num, round) {
    round = round || true;
    num = (round) ? Math.round(num) : num;
    return formatters.number(num, 0);
  };

  // Basic US currency
  formatters.currency = function(num) {
    return '$' + formatters.number(num, 2);
  };

  // Percentage
  formatters.percent = function(num, decimals) {
    decimals = (decimals || decimals === 0) ? decimals : 1;
    return formatters.number(num * 100, decimals) + '%';
  };

  // Percent change
  formatters.percentChange = function(num, decimals) {
    return ((num > 0) ? '+' : '') + formatters.percent(num, decimals);
  };

  // Number change
  formatters.change = function(num, decimals) {
    decimals = (decimals || decimals === 0) ? decimals : 2;
    return ((num > 0) ? '+' : '') + formatters.number(num);
  };

  // Converts string into a hash (very basically).
  formatters.hash = function(str) {
    return Math.abs(_.reduce(str.split(''), function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0));
  };

  // Identifier/slug maker
  formatters.identifier = function(str) {
    return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-').replace(/[^\w-]+/g,'');
  };

  return formatters;

});
