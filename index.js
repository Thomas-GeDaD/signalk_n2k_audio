module.exports = function (app) {
  var plugin = {};

  plugin.id = 'my-signalk-plugin';
  plugin.name = 'My Great Plugin';
  plugin.description = 'Plugin that does stuff';

  plugin.start = function (options, restartPlugin) {
    // Here we put our plugin logic
    app.debug('Plugin started');
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
