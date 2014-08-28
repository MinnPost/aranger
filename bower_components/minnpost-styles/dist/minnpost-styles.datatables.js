/**
 * Stylings for Datatables
 */

(function(global, factory) {
  // Common JS (i.e. browserify) environment
  if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    module.exports = factory(require('underscore'), require('jquery'), require('datatables'));
  }
  // AMD
  else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'datatables'], factory);
  }
  // Browser global
  else if (global._ && global.jQuery.fn.dataTable) {
    global.MP = global.MP || {};
    global.MP.datatables = factory(global._, global.jQuery);
  }
  else {
    throw new Error('Could not find dependencies for MinnPost Styles Datatables.' );
  }
})(typeof window !== 'undefined' ? window : this, function(_, $, dt) {

  // Placeholder for datatables stuff
  var datatables = {};

  // Default options
  datatables.defaultOptions = {
    iDisplayLength: 10,
    bLengthChange: false,
    bProcessing: false,
    bAutoWidth: true,
    aaSorting: [[ 0, 'asc' ]],
    aLengthMenu: [[10, 20, 50, -1], [10, 20, 50, 'All']],
    oLanguage: {
      sSearch: '',
      oPaginate: {
        sNext: '<i class="fa fa-arrow-circle-right"></i> <span class="icon-text">Next</span>',
        sPrevious: '<i class="fa fa-arrow-circle-left"></i> <span class="icon-text">Previous</span>'
      }
    },
    // https://datatables.net/usage/options#sDom
    sDom: '<"row datatables-top" <"column-small-50" l > <"column-small-50" f > >  < r > <"table-responsive-medium" t > <"row datatables-bottom" <"column-small-50" i > <"column-small-50" p > >',
    // A hackish way to get a placeholder
    fnDrawCallback: function() {
      $(this).parent().parent().find('.dataTables_filter input').attr('placeholder', 'Search table');
    }
  };

  // Basic datatable creator wrapper
  datatables.makeTable = function($container, options) {
    var $table = $container.find('table');
    options = $.extend(true, {}, options, datatables.defaultOptions);
    $table.dataTable(options);
    return $table;
  };

  // Clear all filtering.
  // See: http://datatables.net/plug-ins/api#fnFilterClear
  $.fn.dataTableExt.oApi.fnFilterClear = function(oSettings) {
    var n;
    var i;
    /* Remove global filter */
    oSettings.oPreviousSearch.sSearch = "";

    /* Remove the text of the global filter in the input boxes */
    if (typeof oSettings.aanFeatures.f != 'undefined') {
      n = oSettings.aanFeatures.f;

      for (i=0, iLen=n.length ; i<iLen ; i++ ) {
        $('input', n[i]).val( '' );
      }
    }

    /* Remove the search text for the column filters
     * NOTE - if you have input boxes for these
     * filters, these will need to be reset
     */
    for (i=0, iLen=oSettings.aoPreSearchCols.length ; i<iLen ; i++) {
      oSettings.aoPreSearchCols[i].sSearch = "";
    }

    /* Redraw */
    oSettings.oApi._fnReDraw(oSettings);
  };

  // Type deteection for formatted numbers.
  // From: http://datatables.net/plug-ins/type-detection
  $.fn.dataTableExt.aTypes.unshift(function(sData) {
    var deformatted = sData.replace(/[^\d\-\.\/a-zA-Z]/g,'');
    if ( $.isNumeric( deformatted ) || deformatted === "-" ) {
      return 'formatted-num';
    }
    return null;
  });

  // Sorting for numbers so that characters do not interfere
  $.fn.dataTableExt.oSort['formatted-num-asc'] = function(a,b) {
    /* Remove any formatting */
    var x = a.match(/\d/) ? a.replace( /[^\d\-\.]/g, "" ) : 0;
    var y = b.match(/\d/) ? b.replace( /[^\d\-\.]/g, "" ) : 0;
    return parseFloat(x) - parseFloat(y);
  };
  $.fn.dataTableExt.oSort['formatted-num-desc'] = function(a,b) {
    var x = a.match(/\d/) ? a.replace( /[^\d\-\.]/g, "" ) : 0;
    var y = b.match(/\d/) ? b.replace( /[^\d\-\.]/g, "" ) : 0;
    return parseFloat(y) - parseFloat(x);
  };

  // Make filter links.  Given a jQuery object find links that
  // have the class .datatables-filter-links.
  // Use: data-col attribute to choose column
  // Use: data-text for the text to filter with
  datatables.listenFilterLinks = function($datatable, $container, activeClass) {
    activeClass = activeClass || 'active';

    $container.on('click.mp.filterLinks', '.datatables-filter-link', function(e) {
      e.preventDefault();
      var $thisLink = $(this);

      if ($thisLink.hasClass('filter-clear')) {
        $dataTable.fnFilterClear();
      }
      else {
        $dataTable.fnFilter($thisLink.data('text'), $thisLink.data('col'));
      }

      $container.find('.datatables-filter-link').removeClass(activeClass);
      $thisLink.addClass(activeClass);
    });
  };

  return datatables;

});
