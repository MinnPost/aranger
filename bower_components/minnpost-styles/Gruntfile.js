/* global module:false */

/**
 * Grunt file that handles managing tasks such as rendering
 * SASS, providing a basic HTTP server, building a
 * distribution.
 */
module.exports = function(grunt) {
  var _ = grunt.util._;

  // Project configuration.  Many values are directly read from
  // package.json.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= pkg.license || _.pluck(pkg.licenses, "type").join(", ") %> */' +
        '<%= "\\n\\n" %>'
    },

    // Clean up the distribution fold
    clean: {
      folder: 'dist/'
    },

    // JS Hint checks code for coding styles and possible errors
    jshint: {
      options: {
        curly: true,
        //es3: true,
        forin: true,
        latedef: true,
        //maxlen: 80,
        indent: 2
      },
      files: ['Gruntfile.js', 'demo/demo.js', 'js/*.js']
    },

    // Export SASS vars as JSON
    sassyVars: {
      mp: {
        src: ['styles/_variables.scss'],
        dest: 'dist/<%= pkg.name %>.config.json'
      }
    },

    // Compass is an extended SASS.  Set it up so that it generates to .tmp/
    compass: {
      options: {
        sassDir: 'styles',
        cssDir: '.tmp/css',
        generatedImagesDir: '.tmp/images',
        fontsDir: 'styles/fonts',
        imagesDir: 'images',
        javascriptsDir: 'js',
        //importPath: 'bower_components',
        httpPath: './',
        relativeAssets: true,
        // See: https://github.com/nathansmith/unsemantic/issues/3
        // This does not seem to surpress the deprecation warnings.
        quiet: true
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'expanded',
          relativeAssets: false
        }
      }
    },

    // Copy relevant files over to distribution
    copy: {
      images: {
        files: [
          {
            cwd: './images/',
            expand: true,
            src: ['**'],
            dest: 'dist/images/'
          }
        ]
      }
    },

    // Brings files toggether
    concat: {
      options: {
        separator: '\r\n\r\n'
      },
      // JS
      highcharts: {
        src: ['js/highcharts.js'],
        dest: 'dist/<%= pkg.name %>.highcharts.js'
      },
      maps: {
        src: ['js/maps.js'],
        dest: 'dist/<%= pkg.name %>.maps.js'
      },
      nav: {
        src: ['js/nav.js'],
        dest: 'dist/<%= pkg.name %>.nav.js'
      },
      datatables: {
        src: ['js/datatables.js'],
        dest: 'dist/<%= pkg.name %>.datatables.js'
      },
      formatters: {
        src: ['js/formatters.js'],
        dest: 'dist/<%= pkg.name %>.formatters.js'
      },
      storymaps: {
        src: ['js/storymaps.js'],
        dest: 'dist/<%= pkg.name %>.storymaps.js'
      },
      config: {
        src: ['js/config.js'],
        dest: 'dist/<%= pkg.name %>.config.js',
        options: {
          process: function(src, filepath) {
            // This is pretty hacky
            return src.replace("'REPLACE-CONFIG'", grunt.file.read('dist/minnpost-styles.config.json'));
          }
        }
      },
      // CSS
      css: {
        src: [
          '<%= compass.options.cssDir %>/main.css'
        ],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },

    // Minify JS for network efficiency
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      highcharts: {
        src: ['dist/<%= pkg.name %>.highcharts.js'],
        dest: 'dist/<%= pkg.name %>.highcharts.min.js'
      },
      maps: {
        src: ['dist/<%= pkg.name %>.maps.js'],
        dest: 'dist/<%= pkg.name %>.maps.min.js'
      },
      nav: {
        src: ['dist/<%= pkg.name %>.nav.js'],
        dest: 'dist/<%= pkg.name %>.nav.min.js'
      },
      datatables: {
        src: ['dist/<%= pkg.name %>.datatables.js'],
        dest: 'dist/<%= pkg.name %>.datatables.min.js'
      },
      formatters: {
        src: ['dist/<%= pkg.name %>.formatters.js'],
        dest: 'dist/<%= pkg.name %>.formatters.min.js'
      },
      config: {
        src: ['dist/<%= pkg.name %>.config.js'],
        dest: 'dist/<%= pkg.name %>.config.min.js'
      },
      storymaps: {
        src: ['dist/<%= pkg.name %>.storymaps.js'],
        dest: 'dist/<%= pkg.name %>.storymaps.min.js'
      }
    },

    // Minify CSS for network efficiency
    cssmin: {
      options: {
        banner: '<%= meta.banner %>',
        report: true
      },
      css: {
        src: ['<%= concat.css.dest %>'],
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },

    // HTTP Server
    connect: {
      server: {
        options: {
          port: 8833
        }
      }
    },

    // Watches files for changes and performs task
    watch: {
      files: ['<%= jshint.files %>', 'styles/*.scss'],
      tasks: 'default'
    },

    // Deploy to S3, specific to MinnPost
    s3: {
      options: {
        // These are assumed to be environment variables:
        //
        // AWS_ACCESS_KEY_ID
        // AWS_SECRET_ACCESS_KEY
        //
        // See https://npmjs.org/package/grunt-s3
        //key: 'YOUR KEY',
        //secret: 'YOUR SECRET',
        bucket: 'data.minnpost',
        access: 'public-read',
        gzip: true
      },
      mp_deploy: {
        upload: [
          {
            src: 'dist/*',
            dest: 'projects/<%= pkg.name %>/<%= pkg.version %>/'
          },
          {
            src: 'dist/images/**/*',
            dest: 'projects/<%= pkg.name %>/<%= pkg.version %>/images/',
            rel: 'dist/images'
          }
        ]
      }
    }
  });

  // Load plugin tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-s3');

  // Create custom task to read SASS vars and output JSON.  This is so
  // we don't have to maintain variables in two places.  This is pretty
  // fragile so be gentle.
  grunt.registerMultiTask('sassyVars', 'Sass those vars.', function() {
    var options = this.options({
      force: false
    });
    var sassVarRegexp = /\$([a-zA-Z\-_0-9]+):\s*(.*?|[\s\S]*?)\s!default;/gm;
    var json = {};
    var match;
    var cleanVar = function(str) {
      str = str.trim();
      str = str.replace(/[\s|\n|\r]+/g, ' ');
      str = str.replace(/^"(.*?)"$/, '$1');
      str = str.replace(/\("(.*?)"*,\s+?"*(.*?)"*\)/g, '("$1", "$2")');
      if (str.indexOf('(') === 0) {
        str = str.replace(/\(/g, '[').replace(/\)/g, ']');
        str = JSON.parse(str);
      }
      return str;
    };

    // Go through each set of files
    this.files.forEach(function(f) {
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        else {
          return true;
        }
      }).map(function(filepath) {
        return grunt.file.read(filepath);
      }).join(' ');

      // Extract values
      do {
        match = sassVarRegexp.exec(src);
        if (match !== null) {
          json[match[1]] = cleanVar(match[2]);
        }
      } while (match !== null);

      grunt.file.write(f.dest, JSON.stringify(json, null, '  '));
      grunt.log.writeln('File ' + f.dest + ' created.');
    });
  });

  // Default build task
  grunt.registerTask('default', ['jshint', 'compass', 'clean', 'sassyVars', 'copy', 'concat', 'cssmin', 'uglify']);

  // Server/watch
  grunt.registerTask('server', ['default', 'connect', 'watch']);

  // Server/watch
  grunt.registerTask('deploy', ['s3']);

};
