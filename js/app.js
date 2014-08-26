

(function() {
  var items = _.range(8, 80);
  var template = document.getElementById('main-template-container').innerHTML;
  var rows = 30;
  var columns = 30;
  var cells = rows * columns;

  // Make ractive handler
  var r = new Ractive({
    el: '#main-template-view',
    template: template,
    data: {
      rows: rows,
      columns: columns,
      cells: cells,
      rowsArray: _.range(rows),
      columnsArray: _.range(columns),
      cellsArray: new Array(cells),
      items: items,
      itemsString: JSON.stringify(items)
    }
  });

  // If items change, fill the array
  r.observe('items', function(n, o) {
    if (_.isArray(n) && n.length > 0) {
      _.each(n, function(nv, ni) {
        r.set('cellsArray.' + ni, nv);
      });

      // Also, update string version
      r.set('itemsString', JSON.stringify(n));
    }
  });

  // Method to insert value where one exists
  r.insert = function(n, p) {
    var cells = r.get('cellsArray');
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
    r.merge('cellsArray', cells);
  };

  // Events.  'c' is cell event, and 'i' is for item event
  r.on({
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
          r.insert([n, this.get('cellsArray.' + n)], p);
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

})();
