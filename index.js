const util = require('util')
const SimpleCan = require('@canboat/canboatjs').SimpleCan

module.exports = function(app) {
  var plugin = {}
  var unsubscribes = []
  let timersendCI = null

  plugin.id = 'signalk_n2k_audio';
  plugin.name = 'signalk_n2k_audio';
  plugin.description = 'a audio server device simulator fo nmea2000';

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
      // Connect
    
    this.simpleCan = new SimpleCan({
      app,
      canDevice: options.candevice,
      preferredAddress: 35,
      transmitPGNs: [ 130580, 130573 ],
      addressClaim: {  //60928
        "Unique Number": 76223,
        "Manufacturer Code": 'Fusion Electronics', //generates a second device ?
        "Device Function": 130,
        "Device Class": 'Entertainment',
        "Device Instance Lower": 0,
        "Device Instance Upper": 0,
        "System Instance": 0,
        "Industry Group": 'Marine',
        "Reserved1" : 0
      },
      productInfo: { //126996
        "NMEA 2000 Version": 1301,
        "Product Code": 3115,
        "Model ID": "UD-650",
        "Software Version Code": "2.0.265",
        "Model Version": "FUSION-LINK-1.0",
        "Model Serial Code": 76223,
        "Certification Level": 1,
        "Load Equivalency": 1
      }
    })
    this.simpleCan.start()
    app.setPluginStatus(`Connected to ${options.candevice}`)

    app.on('N2KAnalyzerOut', (n2k) => {
      if ( n2k.pgn == 126720
           && n2k.dst === this.simpleCan.candevice.address
           && n2k.fields['Manufacturer Code'] === 'Fusion'
           && n2k.fields['Proprietary ID'] === 'Request Status'
         ) {
        console.log("sende config")

        this.simpleCan.sendPGN({ //1
          pgn:130820,
          dst: 255,
          'Manufacturer Code': 419,
          'Industry Code': 4,
          'Message ID': 'alive',
          'A': 128,
          'A1': 1 ,
          'A2': 0 ,
          'A3': 23 ,
          'A4': 0 ,
          'A5': 2 ,
          'A6': 0 ,
          'A7': 9 ,
          'A8': 1 ,
        })

        this.simpleCan.sendPGN({ //3
          pgn:130820,
          dst: 255,
          'Manufacturer Code': 419,
          'Industry Code': 4,
          'Message ID': 'deviceID',
          'A': 128,
          'A1': 13,
        })

        this.simpleCan.sendPGN({ //33
            pgn:130820,
            dst: 255,
              'Manufacturer Code': 419,
              'Industry Code': 4,
              'Message ID': 'Unit Name',
              'A':128,
              'Name': 'FUSION',
          })

        this.simpleCan.sendPGN({ //2
          pgn:130820,
          dst: 255,
            'Message ID': 'Source',
            'Manufacturer Code': 419,
            'Industry Code': 4,
            'A': 128,
            'Source ID': 11,
            'Current Source ID': 11,
            'D': 10,
            'E': 21,
            'Source': 'BT',
        })

        this.simpleCan.sendPGN({ //4
            pgn:130820,
            dst: 255,
              'Message ID': 'Track Info',
              'Manufacturer Code': 419,
              'Industry Code': 4,
              'A': 128,
              'Transport': 0,
              'X': 0,
              'B': 0,
              'Track #': 0,
              'Track Count': 0,
              'E':0,
              'Track Length':0.000,
              'G':0.000,
              'H':0,            
            })

            this.simpleCan.sendPGN({ //5
              pgn:130820,
              dst: 255,
                'Message ID': 'Track Title',
                'Manufacturer Code': 419,
                'Industry Code': 4,
                'A': 128,
                'B': 11,
                'Track': 'Track1',
              })

              this.simpleCan.sendPGN({ //32 Power state
                pgn:130820,
                dst: 255,
                  'Message ID': 'Track Title',
                  'Manufacturer Code': 419,
                  'Industry Code': 4,
                  'A': 128,
                  'State': 1,
                })

      }
      
      if (n2k.pgn == 59904
        && n2k.dst === this.simpleCan.candevice.address
        && n2k.fields.PGN === 126998
      ){
        this.simpleCan.sendPGN({ //wrong data in pgn.h
          pgn:126998,
          dst: 255,
          'Installation Description #1': 'UD-650',
          'Installation Description #2': 'FUSION',
          'Installation Description #3': 'Fusion Electronics Ltd',
        })
      } 

      if (n2k.pgn==126720 || n2k.pgn==130820 
        || n2k.pgn==130816 || n2k.pgn==130820 
        || n2k.pgn==60928 || n2k.pgn==59904 
        || n2k.pgn==130530 || n2k.fields.PGN == 130573 
        || n2k.fields.PGN== 130574){  //!!126720 Comand from Plotter?
        //console.log("watchdata:")
        //console.log(n2k);
      }

    })   
    }
    
  plugin.stop = function() {
  }

  return plugin
}
