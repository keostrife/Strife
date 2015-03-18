module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        compress: {
          //drop_console: true
        }
      },
      js: {
        files: [{
          src: 'assets/js_import/**/*.js',
          dest: 'assets/js/main.min.js'
        }]
      }
    },
    clean: ["cache/*"],
    compass: {
      dist: {
        options: {
          config: 'sass-config.rb'
        }
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "assets/css/main.css": "assets/less/main.less"
        }
      }
    },
    watch: {
      js: {
        files: ['assets/js_import/**/*.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
        }
      },
      sass: {
        files: ['assets/sass/**/*.scss', 'assets/sass_import/**/*.scss'],
        tasks: ['compass'],
        options: {
          spawn: false,
        }
      },
      less: {
        files: ['assets/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          spawn: false,
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'compass', 'less', 'clean', 'watch']);

};