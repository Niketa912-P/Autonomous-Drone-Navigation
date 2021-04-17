var autonomy = require('ardrone-autonomy');
var mission = autonomy.createMission();

console.log("Here we go!")

mission.takeoff()
         .zero()         // Sets the current state as the reference
         .altitude(1)
         .taskSync(console.log("Checkpoint 1"))
         .go({x: 0, y: 0, z: 1, yaw: 90})
         .taskSync(console.log("Checkpoint 2"))
         .hover(1000)
         .go({x: 0, y: 0, z: 1, yaw: 180})
         .taskSync(console.log("Checkpoint 3"))
         .hover(1000)
         .go({x: 0, y: 0, z: 1, yaw: 270})
         .taskSync(console.log("Checkpoint 4"))
         .hover(1000)
         .go({x: 0, y: 0, z: 1, yaw: 0})
         .land();


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
