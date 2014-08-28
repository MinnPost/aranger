/**
 * Stylings and interactions for maps
 */

(function(global, factory) {
  // Common JS (i.e. browserify) environment
  if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    module.exports = factory(require('jquery'), require('underscore'), require('storymap'));
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
    define(['jquery', 'underscore', 'storymap'], factory);
  }
  // Browser global
  else if (global.jQuery && global._ && global.VCO) {
    global.MP = global.MP || {};
    global.MP.storymaps = factory(global.jQuery, global._, global.VCO);
  }
  else {
    throw new Error('Could not find dependencies for MinnPost Styles Story Maps.' );
  }
})(typeof window !== 'undefined' ? window : this, function($, _, storymap) {

  var s = {};

  // Wrapper around creating a map
  s.makeStorymap = function(id, data, expand) {
    expand = expand || false;
    var $map = $('#' + id);
    var sMap, mapOffset;

    // Expand container to width of window
    if (expand) {
      mapOffset = $map.offset();
      $map.parent().css('position', 'relative');
      $map
        .css('position', 'relative')
        .css('left', (mapOffset.left * -1) + 'px')
        .width($(window).width())
        .addClass('expanded');
    }

    // Make map
    sMap = new storymap.StoryMap(id, data, {
      map_type: 'https://{s}.tiles.mapbox.com/v3/minnpost.map-wi88b700/{z}/{x}/{y}.png',
      map_subdomains: 'abcd',
      map_mini: false,
      line_color: '#0D57A0',
      line_color_inactive: '#404040',
      line_join: 'miter',
      line_weight: 3,
      line_opacity: 0.90,
      line_dash: '5,5',
      show_lines: true,
      show_history_line: true
      //slide_padding_lr: 20,
      //layout: 'landscape',
      //width: '100%'
    });

    // Customize map a bit
    sMap._map.on('loaded', function() {
      this._map.removeControl(this._map.attributionControl);

      // Some styles are manually added
      $map.find('.vco-storyslider .vco-slider-background').attr('style', '');
    });

    // Handle resize
    $(window).on('resize', function(e) {
      _.throttle(function() {
        sMap.updateDisplay();
      }, 400);
    });

    return sMap;
  };


  return s;
});
