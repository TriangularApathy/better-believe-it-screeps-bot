// Handles the spawning of different creeps based on the creep queue
/** 
 * @param {string} roomName
**/
function spawnCreeps(roomName) {
    // Get spawns in room from memory
    var roomSpawns = Memory.rooms[roomName].spawns;

    // Each spawn can produce a single creep
    for (let spawn in roomSpawns) {

    }
    
    
}

exports.module = {
    spawnCreeps
}