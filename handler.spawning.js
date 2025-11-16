const { writeLog, LOG_TYPE } = require("./handler.logging");

// Description of function
/**
 * @param {string} roomName - Name of room to spawn creeps for
 */
function spawnCreeps (roomName) {
    // Get room index, data, and queue from memory
    let roomIndex = Memory.rooms.findIndex(room => room.roomName === roomName);
    let roomObject = Memory.rooms[roomIndex];
    let queue = roomObject.roomData.queues.creepQueue;

    // Each spawn in room can produce a single creep
    // Look for energy from extensions?
}

module.exports = {
    spawnCreeps
};