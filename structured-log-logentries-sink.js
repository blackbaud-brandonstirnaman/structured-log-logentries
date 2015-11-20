'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.structuredLog.sink.logEntries = factory();
  }
}(this, function() {
  var LogEntriesSink = function (options) {
    if (!options) {
      throw new Error("'options' parameter is required.");
    }

    if (!options.token) {
      throw new Error("'options.token' field is required.");
    }

    var self = this;
    var LE = require('le_js');
    LE.init({ token: options.token, ssl: options.ssl, catchall: options.catchall, page_info: options.page_info, print: options.print, trace: options.trace });

    self.toString = function () { return 'LogEntriesSink'; };
    self.emit = function(evts, done) {
      var processedEvts = evts.forEach(function (evt) {
        var formatted = evt.messageTemplate.render(evt.properties);

        var logFunc = LE[evt.level.toLowerCase()];
        if (logFunc == null) {
          logFunc = LE.log;
        }

        logFunc({
          message: formatted,
          level: evt.level,
          data: evt.properties
        });
      });
    };
  };

  return function(options) { return new LogEntriesSink(options); };
}));