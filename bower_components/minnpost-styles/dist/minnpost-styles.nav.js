/**
 * Navigation interaction
 */

(function(global, factory) {
  // Common JS (i.e. browserify) environment
  if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    module.exports = factory(require('jquery'), require('underscore'));
  }
  // AMD?
  else if (typeof define === 'function' && define.amd) {
    define(['jquery', 'underscore'], factory);
  }
  // Browser global
  else if (global.jQuery && global._) {
    global.MP = global.MP || {};
    global.MP.nav = factory(global.jQuery, global._);
  }
  else {
    throw new Error('Could not find dependencies for MinnPost Styles Navigation.' );
  }
})(typeof window !== 'undefined' ? window : this, function($, _) {

  // Wrapper object for some various things
  var nav = {};

  // Plugin for sticking things.  Defaults are for sticking to top.
  nav.MPStickDefaults = {
    activeClass: 'stuck top',
    wrapperClass: 'minnpost-full-container',
    topPadding: 0,
    throttle: 90
  };
  function MPStick(element, options) {
    // Defined some values and process options
    this.element = element;
    this.$element = $(element);
    this._defaults = nav.MPStickDefaults;
    this.options = $.extend( {}, this._defaults, options);
    this._name = 'mpStick';
    this._scrollEvent = 'scroll.mp.mpStick';
    this._on = false;

    this.init();
  }
  MPStick.prototype = {
    init: function() {
      // If contaier not passed, use parent
      this.$container = (this.options.container === undefined) ? this.$element.parent() : $(this.options.container);

      this.elementHeight = this.$element.outerHeight(true);

      // Create a spacer element so content doesn't jump
      this.$spacer = $('<div>').height(this.elementHeight).hide();
      this.$element.after(this.$spacer);

      // Add wrapper
      if (this.options.wrapperClass) {
        this.$element.wrapInner('<div class="' + this.options.wrapperClass + '"></div>');
      }

      // Throttle the scoll listen for better perfomance
      this._throttledListen = _.bind(_.throttle(this.listen, this.options.throttle), this);
      this._throttledListen();
      $(window).on(this._scrollEvent, this._throttledListen);
    },

    listen: function() {
      var containerTop = this.$container.offset().top;
      var containerBottom = containerTop + this.$container.height();
      var scrollTop = $(window).scrollTop();
      var top = (containerTop - this.options.topPadding);
      var bottom = (containerBottom - this.elementHeight - this.options.topPadding - 2);

      // Test whether we are in the container and whether its
      // already stuck or not
      if (!this._on && scrollTop > top && scrollTop < bottom) {
        this.on();
      }
      else if (this._on && (scrollTop < top || scrollTop > bottom)) {
        this.off();
      }
    },

    on: function() {
      this.$element.addClass(this.options.activeClass);
      if (this.options.topPadding) {
        this.$element.css('top', this.options.topPadding);
      }
      this.$spacer.show();
      this._on = true;
    },

    off: function() {
      this.$element.removeClass(this.options.activeClass);
      if (this.options.topPadding) {
        this.$element.css('top', 'inherit');
      }
      this.$spacer.hide();
      this._on = false;
    },

    remove: function() {
      this.$container.off(this._scrollEvent);
    }
  };
  // Register plugin
  $.fn.mpStick = function(options) {
    return this.each(function() {
      if (!$.data(this, 'mpStick')) {
        $.data(this, 'mpStick', new MPStick(this, options));
      }
    });
  };



  // Plugin for scroll spying
  nav.MPScrollSpyDefaults = {
    activeClass: 'active',
    offset: 80,
    throttle: 200
  };
  function MPScrollSpy(element, options) {
    // Set some initial values and options
    this.element = element;
    this.$element = $(element);
    this._defaults = nav.MPScrollSpyDefaults;
    this.options = $.extend( {}, this._defaults, options);
    this._name = 'mpScollSpy';
    this._scrollEvent = 'scroll.mp.mpScollSpy';

    this.init();
  }
  MPScrollSpy.prototype = {
    init: function() {
      // Get listeners and targets
      this.$listeners = this.$element.find('[data-spy-on]');
      this.$targets = this.$element.find('[data-spy-me]');

      // Throttle the scoll listen for better perfomance
      this._throttledListen = _.bind(_.throttle(this.listen, this.options.throttle), this);
      this._throttledListen();
      $(window).on(this._scrollEvent, this._throttledListen);

      // Handle click
      this.$listeners.on('click', _.bind(this.gotoClick, this));
    },

    listen: function() {
      var thisPlugin = this;
      var scrollTop = $(window).scrollTop();
      var target;

      // Find target that is closest to scroll top
      this.$targets.each(function() {
        var $target = $(this);
        if ($target.offset().top <= (scrollTop + (thisPlugin.options.offset + 5))) {
          target = $target.data('spyMe');
        }
      });

      // Once found one, then mark the listener
      if (target) {
        this.$listeners.removeClass(this.options.activeClass);
        this.$element.find('[data-spy-on="' + target + '"]').addClass(this.options.activeClass);
      }
    },

    gotoClick: function(e) {
      e.preventDefault();
      var $listener = $(e.target);

      this.goto($(e.target).data('spyOn'));
    },

    goto: function(target) {
      var $target = this.$element.find('[data-spy-me="' + target + '"]');
      var top = $target.offset().top;

      $('html, body').animate({
        scrollTop: (top - this.options.offset)
      }, 600);
    },

    remove: function() {
      this.$container.off(this._scrollEvent);
    }
  };
  // Register plugin
  $.fn.mpScrollSpy = function(options) {
    return this.each(function() {
      if (!$.data(this, 'mpScrollSpy')) {
        $.data(this, 'mpScrollSpy', new MPScrollSpy(this, options));
      }
    });
  };

  return nav;
});
