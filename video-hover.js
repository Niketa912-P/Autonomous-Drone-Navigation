var autonomy = require('ardrone-autonomy')
  , arDrone = require('ar-drone')
  , arDroneConstants = require('ar-drone/lib/constants')
  , mission  = autonomy.createMission()
  ;

var PaVEParser = require('../lib/video/PaVEParser');
var output = require('fs').createWriteStream('./vid.h264');

//var video = arDrone.createClient().getVideoStream();
//var parser = new PaVEParser();



function navdata_option_mask(c) {
  return 1 << c;
}

// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
  | navdata_option_mask(arDroneConstants.options.WIFI)
);

// Land on ctrl-c
var exiting = false;
process.on('SIGINT', function() {
    if (exiting) {
        process.exit(0);
    } else {
        console.log('Got SIGINT. Landing, press Control-C again to force exit.');
        exiting = true;
        mission.control().disable();
        mission.client().land(function() {
            process.exit(0);
        });
    }
});

// Connect and configure the drone
mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', navdata_options);
mission.client().config('video:video_channel', 0);
mission.client().config('detect:detect_type', 12);

// Log mission for debugging purposes
//mission.log("mission-" + df(new Date(), "yyyy-mm-dd_hh-MM-ss") + ".txt");

//parser
//  .on('data', function(data) {
//    output.write(data.payload);
//  })
//  .on('end', function() {
//    output.end();
//  });

//video.pipe(parser);

// Plan mission
mission.takeoff()
	.altitude(1)
	.go({x: 0, y: 1, z: 0, ro11: 90})
	.land();


// Execute mission
mission.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
    } else {
        console.log("We are done!");
        process.exit(0);
    }
});
