(function () {
  'use strict';

  var format = require('string-format'),
    path = require('path'),
    _ = require('underscore'),
    exec = require('execSync').exec,
    sync = require('sync');

  var build = exports;

  _.extend(build, /** @exports build_common */ {

    // extension path mapping
    // TODO finish
    extension_prefixes: {
      'private': [
        'manufacturing',
        'inventory'
      ],
      'xtuple': [

      ]
    },

    /**
     * Generate the core app installation command
     * @static
     */
    getCoreBuildCommand: function (db, options) {
      var src_path = path.resolve(options.xt.appdir),
        formatter = _.defaults(db, {
          bin: path.resolve(src_path, 'scripts/build_app.js'),
          config_js: options.xt.serverconfig.config_js
        }),
        cmd = [
          'cd {appdir} &&'.format({ src: src_path }),
          'sudo node {bin}',
          '-b {file}',
          '-d {flavor}',
          '-c {config_js}',
          '-i'
        ].join(' ').format(formatter);

      //console.log(cmd);
      return cmd;
    },

    /**
     * Generate the extension installation command
     * @static
     */
    getExtensionBuildCommand: function (db, options, extension) {
      var src_path = path.resolve(options.xt.appdir),
        private_ext_path = path.resolve(src_path, '..', 'private-extensions'),
        public_ext_path = path.resolve(src_path, '..', 'xtuple-extensions'),
        prefix = _.find(_.keys(build.extension_prefixes), function (key) {
          return _.contains(build.extension_prefixes[key], extension);
        }),
        formatter = _.defaults(db, {
          bin: path.resolve(src_path, 'scripts/build_app.js'),
          extension_path: path.resolve(src_path, '..', prefix + '-extensions', 'source', extension)
        });

      return [
        'cd {appdir} &&'.format({ src: src_path }),
        'sudo node {bin}',
        '-d {flavor}',
        '-c {config_js}',
        '-e {extension_path}'
      ].join(' ').format(formatter);
    }
  });
})();