/**
 * Main aRanger app JS.
 */

(function() {
  var exampleItems = ["AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE",
    "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
    "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV",
    "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA",
    "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV",
    "WI", "WY"];
  var template = document.getElementById('main-template-container').innerHTML;
  var rows = 30;
  var columns = 30;
  var cells = rows * columns;
  var View, r;

  // Make ractive view handler which will hold most of our methods
  View = Ractive.extend({
    el: '#main-template-view',
    template: template,

    init: function() {
      var thisView = this;

      // Observations
      this.observe({
        // If items change through the interface, then update data
        // structure
        arrangementString: function(n, o) {
          var p;

          if (_.isString(n) && n.length > 0) {
            p = JSON.parse(n);
            p = this.standardizeArrangement(p);
            this.set('arrangement', p);
          }
        },

        // If actual data changes
        arrangement: function(n, o) {
          if (_.isArray(n) && n.length > 0) {
            n = this.standardizeArrangement(n);
            this.set('cellsArray', this.arrangementToCells(n));
            this.set('arrangementString', JSON.stringify(n));
          }
        },

        // If cells array changes, update items
        cellsArray: function(n, o) {
          if (_.isArray(n) && n.length > 0) {
            this.set('arrangement', this.cellsToArrangement(n));
          }
        }
      });

      // Events.  'c' is cell event, and 'i' is for item event
      this.on({
        // Start dragging an item
        idragstart: function(e) {
          var i = parseInt(e.node.getAttribute('data-index'), 10);
          var value = this.get('cellsArray.' + i);

          // Visually mark
          e.node.classList.add('dragging');
          // Attach data to dragging placeholder
          this.set('dragging', [i, value]);
        },
        // When done dragging and not dropped on a valid place
        idragend: function(e) {
          // Visually mark
          e.node.classList.remove('dragging');
          // Reset data
          this.set('dragging', undefined);
        },
        // Currently dragging over a draggable place
        cdragover: function(e) {
          // This is necessary so that a drop can happen
          e.original.preventDefault();
        },
        // Entering a draggable place
        cdragenter: function(e) {
          // Visually mark
          e.node.classList.add('dragover');
        },
        // Leave draggable place
        cdragleave: function(e) {
          // Visually mark
          e.node.classList.remove('dragover');
        },
        cdrop: function(e) {
          var p = this.get('dragging');
          var n = parseInt(e.node.getAttribute('data-index'));
          var same = (p[0] === n);
          var existing = !_.isUndefined(this.get('cellsArray.' + n))

          // Visually mark
          e.node.classList.remove('dragover');
          // Successful move
          if (!same) {
            if (existing) {
              this.insertItem([n, this.get('cellsArray.' + n)], p);
            }
            else {
              this.set('cellsArray.' + n, p[1]);
              this.set('cellsArray.' + p[0], undefined);
            }
          }
          // Done clear data
          this.set('dragging', undefined);
        }
      });
    },

    // Process items into arrangement array.  Items should be just an array of
    // numbers or strings, while a arrangement should be an array of triplets
    // of [x, y, v] (x is column and )
    standardizeArrangement: function(items) {
      var arrange = [];
      var c = this.get('columns');
      var r = this.get('rows');

      if (_.isArray(items) && _.isArray(items[0]) && items[0].length === 3) {
        arrange = items;
      }
      else {
        _.each(items, function(i, ii) {
          arrange.push([(ii % c), parseInt((ii / c), 10), i]);
        });
      }

      return arrange;
    },

    // Process arrangement into cells array
    arrangementToCells: function(arrangement) {
      var c = this.get('columns');
      var r = this.get('rows');
      var l = c * r;
      var cells = new Array(l);

      _.each(arrangement, function(a, ai) {
        var place = ((a[1] * c) + a[0]);
        cells[place] = a[2];
      });

      return cells;
    },

    // Turns cells into arrangement
    cellsToArrangement: function(cells) {
      var c = this.get('columns');
      var r = this.get('rows');
      var arrange = [];

      _.each(cells, function(d, di) {
        if (!_.isUndefined(d)) {
          arrange.push([(di % c), parseInt((di / c), 10), d]);
        }
      });

      return arrange;
    },

    // Method to insert value where one exists
    insertItem: function(n, p) {
      var cells = this.get('cellsArray');
      var nextBlank, i;

      // Remove old value, as it could be replaced in the movement
      cells[p[0]] = undefined;

      // Find the next blank
      nextBlank = n[0];
      do {
        nextBlank = nextBlank + 1;
      } while (cells[nextBlank]);

      // Pull forward
      for (i = nextBlank; i > n[0]; i--) {
        cells[i] = cells[i - 1];
      }

      // Add new value
      cells[n[0]] = p[1];

      // Merge back in
      this.merge('cellsArray', cells);
    }
  });

  // Initialize view with data
  r = new View({
    data: {
      rows: rows,
      columns: columns,
      cells: cells,
      rowsArray: _.range(rows),
      columnsArray: _.range(columns),
      cellsArray: new Array(cells),
      arrangementString: JSON.stringify(exampleItems)
    }
  });

})();
