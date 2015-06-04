var site = "site/";
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
          src: site+'assets/js_import/**/*.js',
          dest: site+'assets/js/main.min.js'
        }]
      }
    },
    clean: [site+"cache/*"],
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
          site+"assets/css/main.css": site+"assets/less/main.less"
        }
      }
    },
    watch: {
      js: {
        files: [site+'assets/js_import/**/*.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
        }
      },
      sass: {
        files: [site+'assets/sass/**/*.scss', site+'assets/sass_import/**/*.scss'],
        tasks: ['compass'],
        options: {
          spawn: false,
        }
      },
      less: {
        files: [site+'assets/less/**/*.less'], // which files to watch
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