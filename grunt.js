/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'apps/dialer/js/settings.js', 'apps/dialer/js/background.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    jshint: {
      options: {
        curly: false,
        eqeqeq: false,
        immed: true,
        latedef: true,
        newcap: false,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: false,
        browser: true,
        smarttabs: true
      },
      globals: {
        console: false,
        alert: false,
        SettingsListener: false,
        NotificationHelper: false,
        SmsManager: false,
        Settings: true,
        Instant: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint watch');

};
