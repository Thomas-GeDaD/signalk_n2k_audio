module.exports = function (app) {
  var plugin = {};
  var productinformation = "%s,6,126996,12,255,134,34,8,b1,46,45,37,30,33,36,37,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,33,2e,31,31,2e,34,32,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,52,61,79,6d,61,72,69,6e,65,20,41,58,49,4f,4d,20,39,20,52,56,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,30,36,37,30,39,36,37,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,2,1"
  var unsubscribes = [];


  plugin.id = 'signalk_n2k_audio';
  plugin.name = 'signalk_n2k_audio';
  plugin.description = 'a audio server device simulator fo nmea2000';

  plugin.start = function (options, restartPlugin) {
    // Here we put our plugin logic
    app.debug('Plugin started');
    
    function sendPI () {
        let msg= [util.format(productinformation, (new Date()).toISOString())]
        console.log (msg)
        app.emit(
        'nmea2000out', msg);
        }
    timersenPI =  setInterval(sendPI,2000)

    let localSubscription = {
        context: '*', // Get data for all contexts
        subscribe: [{
            path: '*', // Get all paths
            period: 5000 // Every 5000ms
        }]
    };

    app.subscriptionmanager.subscribe(
        localSubscription,
        unsubscribes,
        subscriptionError => {
            app.error('Error:' + subscriptionError);
        },
        delta => {
        delta.updates.forEach(u => {
        console.log(u);
        });
    }
  );





  };

  plugin.stop = function () {
    if (timersenPI) {
    clearInterval(timersenPI)
    }
    app.debug('Plugin stopped');
  };

  plugin.schema = {
    // The plugin schema
  };

  return plugin;
};

///heartbeat: 126993
//https://github.com/htool/emulateSonicHub4mopidy/blob/195c81c25eaa33d13f7586280af0c36bb3ed3085/emulate.js

//60928 data a 59904
