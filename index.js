const util = require('util')
const SimpleCan = require('@canboat/canboatjs').SimpleCan

module.exports = function(app) {
  var plugin = {}
  var unsubscribes = []

  plugin.id = "signalk-candevice-example-plugin"
  plugin.name = "Candevice Example"
  plugin.description = "Candevice Example"

  plugin.schema = function() {
    return {
      type: "object",
      properties: {
        candevice: {
          title: "Serial Port",
          type: "string",
          default: 'can0'
        }
      }
    }
  }

  plugin.start = function(options) {
    
    this.simpleCan = new SimpleCan({
      app,
      canDevice: options.candevice,
      preferredAddress: 35,
      transmitPGNs: [ 130580, 130573 ],
      addressClaim: { 
        "Unique Number": 139725,
        "Manufacturer Code": 'Fusion Electronics',
        "Device Function": 130,
        "Device Class": 'Entertainment',
        "Device Instance Lower": 0,
        "Device Instance Upper": 0,
        "System Instance": 0,
        "Industry Group": 'Marine'
      },
      productInfo: { //126996
        "NMEA 2000 Version": 1300,
        "Product Code": 667,
        "Model ID": "UD-650",
        "Software Version Code": "2.0.265",
        "Model Version": "FUSION-LINK-1.0",
        "Model Serial Code": "7223",
        "Certification Level": 0,
        "Load Equivalency": 1
      }
    })
    this.simpleCan.start()
    app.setPluginStatus(`Connected to ${options.candevice}`)


    app.on('N2KAnalyzerOut', (n2k) => {
      if ( n2k.pgn === 59904
           && n2k.dst === this.simpleCan.candevice.address
           && n2k.fields.PGN === 130580
         ) {
        this.simpleCan.sendPGN({
          pgn:130580,
          dst: n2k.src,
          'Power': 'Yes',
          'Default Setting': 0,
          'Tuner Regions': 1,
          'Max favorites':0
        })
      }
      if (n2k.pgn == 126208
          && n2k.dst === this.simpleCan.candevice.address
          && n2k.fields.PGN === 130573
        ){
          this.simpleCan.sendPGN({
            pgn:130573,
            dst: n2k.src,
            'Play support': 'Bluetooth',
            'Browse support': 'Track name',
            'Thumbs support': 'Yes',
            'Connected':'Yes',
            'Repeat support': 1,
            'Shuffle support': 1,
          })
        }

      if (n2k.pgn==126720 || n2k.pgn==130820 || n2k.pgn==130816 || n2k.pgn==130820 || n2k.pgn==60928 || n2k.pgn==59904 || n2k.pgn==130530 || n2k.fields.PGN == 130573){  //!!126720 Comand from Plotter?
        console.log("watchdata:")
        console.log(n2k);
      }
    })
  }

  plugin.stop = function() {
  }

  return plugin
}
