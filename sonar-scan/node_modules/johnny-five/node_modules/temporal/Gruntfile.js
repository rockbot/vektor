"use strict";
module.exports = function(grunt) {
  function readOptionalJSON( filepath ) {
    var data = {};
    try {
      data = grunt.file.readJSON( filepath );
    } catch(e) {}
    return data;
  }

  // Project configuration.
  grunt.initConfig({
    pkg: "<json:package.json>",
    nodeunit: {
      files: ["test/**/*.js"]
    },
    jshint: {
      all: {
        src: ["grunt.js", "lib/**/*.js", "test/**/*.js"],
        options: readOptionalJSON(".jshintrc")
      }
    },
    watch: {
      files: "<config:jshint.files>",
      tasks: "default"
    }
  });
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  // Default task.
  grunt.registerTask( "default", [ "jshint", "nodeunit" ] );


};
