/**
 * Gets config from SASS so that it can be refrenced on the front end.
 */

(function(global, factory) {
  // Common JS (i.e. browserify) environment
  if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    module.exports = factory(require('underscore'), require('jquery'));
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery'], factory);
  }
  // Browser global
  else if (global._ && global.jQuery.fn.dataTable) {
    global.MP = global.MP || {};
    global.MP.colors = factory(global._, global.jQuery);
  }
  else {
    throw new Error('Could not find dependencies for MinnPost Styles Config.' );
  }
})(typeof window !== 'undefined' ? window : this, function(_, $, dt) {
  // Placeholder for config and other vars
  var config = {};
  var lists;

  // We use the build process to replace this data.  Hacky for sure.
  config = {
  "selector-wrapper": ".mp",
  "responsive-points": [
    [
      "all",
      "0px"
    ],
    [
      "small",
      "420px"
    ],
    [
      "medium",
      "640px"
    ],
    [
      "large",
      "960px"
    ],
    [
      "xlarge",
      "1200px"
    ]
  ],
  "grid-gutter": "0.5em",
  "text-line-height": "1.5em",
  "text-size": "1em",
  "text-size-small": "0.85em",
  "text-size-large": "1.25em",
  "space": "1em",
  "space-vertical-padding": "0.25em",
  "space-horizontal-padding": "0.5em",
  "space-vertical-margin": "1em",
  "space-horizontal-margin": "1em",
  "radius": "0.25em",
  "font-size-base": "16px",
  "font-text": "\"Open Sans\", Helvetica, Arial, \"Lucida Grande\", sans-serif",
  "font-heading": "\"Montserrat\", Georgia, \"Times New Roman\", Times, sans-serif",
  "font-monospace": "Menlo, Monaco, Consolas, \"Courier New\", monospace",
  "color-white": "#FFFFFF",
  "color-black": "#000000",
  "color-dark-gray": "#282828",
  "color-medium-gray": "#404040",
  "color-gray": "#7A7A7A",
  "color-light-gray": "#ABABAB",
  "color-lighter-gray": "#CCCCCC",
  "color-lightest-gray": "#F8F8F8",
  "color-minnpost-red": "#801019",
  "color-blue": "#0084A8",
  "color-red": "#C83D2D",
  "color-green": "#469B61",
  "color-orange": "#FF6633",
  "color-yellow": "#FBD341",
  "colors-interface": [
    [
      "dark-gray",
      "$color-dark-gray"
    ],
    [
      "medium-gray",
      "$color-medium-gray"
    ],
    [
      "gray",
      "$color-gray"
    ],
    [
      "light-gray",
      "$color-light-gray"
    ],
    [
      "lighter-gray",
      "$color-lighter-gray"
    ],
    [
      "lightest-gray",
      "$color-lightest-gray"
    ],
    [
      "minnpost-red",
      "$color-minnpost-red"
    ],
    [
      "blue",
      "$color-blue"
    ],
    [
      "red",
      "$color-red"
    ],
    [
      "green",
      "$color-green"
    ],
    [
      "orange",
      "$color-orange"
    ],
    [
      "yellow",
      "$color-yellow"
    ]
  ],
  "color-link": "$color-blue",
  "color-heading": "$color-dark-gray",
  "color-text": "$color-medium-gray",
  "colors-information": [
    [
      "primary",
      "$color-blue"
    ],
    [
      "success",
      "$color-green"
    ],
    [
      "info",
      "$color-light-gray"
    ],
    [
      "warning",
      "$color-yellow"
    ],
    [
      "danger",
      "$color-red"
    ]
  ],
  "colors-data": [
    [
      "green1",
      "#1D8C47"
    ],
    [
      "green2",
      "#32955D"
    ],
    [
      "green3",
      "#36A174"
    ],
    [
      "purple",
      "#55307E"
    ],
    [
      "blue1",
      "#0D57A0"
    ],
    [
      "blue2",
      "#0793AB"
    ],
    [
      "blue3",
      "#55CBDD"
    ],
    [
      "red",
      "#C83D2D"
    ],
    [
      "orange",
      "#FF6633"
    ],
    [
      "yellow",
      "#FBD341"
    ]
  ],
  "colors-political": [
    [
      "dfl",
      "#0793AB"
    ],
    [
      "d",
      "#0793AB"
    ],
    [
      "r",
      "#A1000F"
    ],
    [
      "ip",
      "#FF781F"
    ],
    [
      "lib",
      "#7A7A7A"
    ],
    [
      "swp",
      "#7A7A7A"
    ],
    [
      "cp",
      "#7A7A7A"
    ],
    [
      "cg",
      "#7A7A7A"
    ],
    [
      "gp",
      "#07AB20"
    ],
    [
      "gr",
      "#7A7A7A"
    ],
    [
      "mop",
      "#7A7A7A"
    ],
    [
      "edp",
      "#7A7A7A"
    ],
    [
      "ind",
      "#7A7A7A"
    ],
    [
      "sl",
      "#7A7A7A"
    ],
    [
      "jp",
      "#7A7A7A"
    ]
  ]
};

  // Function to help turn a config value into another if it is a reference
  function findReference(value) {
    if (_.isString(value) && value.indexOf('$') === 0 && !_.isUndefined(config[value.substring(1)])) {
      value = config[value.substring(1)];
    }
    return value;
  }

  // Process config
  if (_.isObject(config)) {
    // Process the lists that are meant to be objects
    lists = ['responsive-points', 'colors-data', 'colors-information', 'colors-interface', 'colors-political'];
    _.each(lists, function(l, li) {
      var converted = {};

      if (!_.isUndefined(config[l])) {
        _.each(config[l], function(i, ii) {
          converted[i[0]] = findReference(i[1]);
        });

        config[l] = converted;
      }
    });
  }

  // Political party names
  config.politicalParties = {
    ip: 'Independence',
    r: 'Republican',
    dfl: 'Democratic-Farmer-Labor',
    d: 'Democratic',
    lib: 'Libertarian Party',
    swp: 'Socialist Workers Party',
    cp: 'Constitution Party',
    cg: 'Constitutional Government',
    gp: 'Green Party',
    gr: 'Grassroots Party',
    mop: 'Minnesota Open Progressives',
    edp: 'Ecology Democracy Party',
    ind: 'Independent',
    sl: 'Socialism and Liberation',
    jp: 'Justice Party',
    np: 'Nonpartisan',
    wi: 'Write-In'
  };

  return config;

});
