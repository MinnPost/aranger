/**
 * Stylings and interactions for maps
 */

(function(global, factory) {
  // Common JS (i.e. browserify) environment
  if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    module.exports = factory(require('leaflet'));
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
    define(['leaflet'], factory);
  }
  // Browser global
  else if (global.MP && global.Leaflet) {
    global.MP = global.MP || {};
    global.MP.maps = factory(global.Leaflet);
  }
  else {
    throw new Error('Could not find dependencies for MinnPost Styles Maps.' );
  }
})(typeof window !== 'undefined' ? window : this, function(L) {

  // Placeholder for maps stuff
  var maps = {};

  // Some general helpful values
  maps.minneapolisPoint = L.latLng(44.983333998267824, -93.26667000248563);
  maps.stPaulPoint = L.latLng(44.95370289870105, -93.08995780069381);
  maps.minnesotaPoint = L.latLng(46.518286790004616, -94.55406386114191);
  maps.mapboxSatelliteStreets = 'minnpost.map-95lgm5jf';
  maps.mapboxStreetsDarkLabels = 'minnpost.map-4v6echxm';
  maps.mapboxStreetsLightLabels = 'minnpost.map-wi88b700';
  maps.mapboxTerrainLight = 'minnpost.map-vhjzpwel';
  maps.mapboxTerrainDark = 'minnpost.map-dhba3e3l';
  maps.mapOptions = {
    scrollWheelZoom: false,
    trackResize: true
  };
  maps.mapStyle = {
    stroke: true,
    color: '#2DA51D',
    weight: 1.5,
    opacity: 0.9,
    fill: true,
    fillColor: '#2DA51D',
    fillOpacity: 0.2
  };
  maps.mapboxAttribution = 'Some map imagery provided by <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>.';
  maps.openstreetmapAttribution = 'Some map data provided by &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.';

  // Make basic Leaflet map.  Takes id of container and mapbox ID
  // in the maps object
  maps.makeLeafletMap = function(id, baseName, center) {
    baseName = baseName || maps.mapboxStreetsLightLabels;
    center = center || maps.minneapolisPoint;

    var map = new L.Map(id, maps.mapOptions);
    var base = new L.tileLayer('//{s}.tiles.mapbox.com/v3/' + baseName + '/{z}/{x}/{y}.png');
    map.addLayer(base);
    map.setView(center, 8);

    // This removes the embedded attribution which should be in the footnote
    // but ensure that attribution is given correctly
    map.removeControl(map.attributionControl);

    return map;
  };

  // Make a Maki icon.  Icon should refer to maki icon short name,
  // size should be s, m, or l and color should be hex without the #.
  //
  // See list of icons: https://www.mapbox.com/maki/
  // Leave icon blank for blank pin
  maps.makeMakiIcon = function(icon, size, color) {
    icon = icon || null;
    color = color || '094C86';
    size = size || 'm';

    var url = 'https://api.tiles.mapbox.com/v3/marker/';
    var iconSizes = {
      's': { iconSize: [20, 50], popupAnchor: [0, -20] },
      'm': { iconSize: [30, 70], popupAnchor: [0, -30] },
      'l': { iconSize: [36,90], popupAnchor: [0, -40] }
    };
    url = url + 'pin-' + size + ((icon === null) ? '' : '-' + icon) + '+' + color + '.png';

    return new L.Icon(L.extend(iconSizes[size], {
      iconUrl: url,
      shadowAnchor: null,
      shadowSize: null,
      shadowUrl: null,
      className: 'maki-marker'
    }));
  };

  // Basic control for a staticly places tooltip
  maps.TooltipControl = L.Control.extend({
    options: {
      position: 'topright'
    },

    initialize: function() {
    },

    update: function(content) {
      this._contentWrapper.innerHTML = content;
      this.show();
    },

    show: function() {
      this._container.style.display = 'block';
    },

    hide: function() {
      this._container.style.display = 'none';
    },

    onAdd: function(map) {
      this._container = L.DomUtil.create('div', 'map-tooltip');
      this._contentWrapper = L.DomUtil.create('div', 'map-tooltip-content');
      this._container.appendChild(this._contentWrapper);
      this.hide();
      return this._container;
    },

    onRemove: function(map) {
    }
  });

  return maps;

});
