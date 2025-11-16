const { writeLog, LOG_TYPE } = require("./handler.logging");

// Description of function
/**
 * @param {string} creep - Name of room to spawn creeps for
 */
function performBuilder (creep) {
    // Get room index, data, and queue from memory
    let roomIndex = Memory.rooms.findIndex(room => room.roomName === roomName);
    let roomObject = Memory.rooms[roomIndex];
    let queue = roomObject.roomData.queues.creepQueue;

    // What if a creep dies while building something?
        // Should a check be added when they are removed from memory?
        // Then remove the creep from the project, making it abandoned

    /** Builder Workflow
     * 1) Check to see creep already has an assignment
     * 1a) If already assigned, continue that assignment (get energy if empty & site energy = 0, move to site, build at site)
     * 1b) If not already assigned, get new assignment
     * 2) Check for any abandoned projects (un-assigned construction sites)
     * 2a) If there is an abandoned project, assign to project
     * 2b) If there are no abandoned projects, check queue
     * 3) Check queue for priority assignments
     * 3a) If there is something in the queue, start new project
     * 4) Start new project from queue
     * 4a) Check any logic associated with building type (reserve 1 container for upgrading)
     * 4b) Determine location for construction site
     * 4c) Create construction site
     * 4d) Assign creep to project
     * 4e) Continue regular logic from 1a
     */
}

module.exports = {
    spawnCreeps
};