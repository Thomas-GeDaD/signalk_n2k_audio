module.exports = function (app) {
  var plugin = {};

  plugin.id = 'signalk_n2k_audio';
  plugin.name = 'signalk_n2k_audio';
  plugin.description = 'a audio server device simulator fo nmea2000';

  plugin.start = function (options, restartPlugin) {
    // Here we put our plugin logic
    app.debug('Plugin started');
    function sendhandshake () {
      app.emit(
        'nmea2000out',
        '2017-04-15T14:57:58.468Z,6,126996,	12,255,134,15,	5	2b	0c	55	44	2d	36	35	30	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	32	2e	30	2e	32	36	35	0	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	46	55	53	49	4f	4e	2d	4c	49	4e	4b	2d	31	2e	30	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	37	36	32	32	33	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	20	1	1');
    }

  };

  plugin.stop = function () {
    // Here we put logic we need when the plugin stops
    app.debug('Plugin stopped');
  };

  plugin.schema = {
    // The plugin schema
  };

  return plugin;
};
