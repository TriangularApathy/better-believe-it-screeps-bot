const { writeLog, LOG_TYPE } = require("./handler.logging");

// Manages the room queue for creep production
/** 
 * @param {string} roomName
**/
function manageCreepQueue(roomName) {
    writeLog('------------------ Starting Creep Queue mgmt -----------------', LOG_TYPE.TRIVIAL);

    //Memory.rooms[0].roomData.queues.creepQueue = [];

    // Get current queue from memory
    let roomIndex = Memory.rooms.findIndex(room => room.roomName === roomName);
    var roomObject = Memory.rooms[roomIndex];
    let creepQueue = roomObject.roomData.queues.creepQueue;
    writeLog(`[${roomName}] Creep Queue: [${creepQueue}]`, LOG_TYPE.REGULAR);

    // Get list of jobs based on operating room tier
    let operatingTier = roomObject.operatingTier;
    let jobList = roomObject.roomData.tiers[operatingTier].jobs;
    writeLog(`[${roomName}] Jobs being managed for this tier: [${jobList.length}]`);

    // Sort jobs by importance
    jobList = jobList.sort((a, b) => b.importance - a.importance);

    // Add missing jobs to queue
	for (let job in jobList) {
		// Get count of each job
        let jobTitle = jobList[job].jobTitle;
        let currentCount = _.filter(Game.creeps, { memory: { job: jobTitle}}).length; // Should go off of room memory instead
        let qtyNeeded = jobList[job].qtyNeeded;
        let jobsInQueue = creepQueue.filter(job => job == jobTitle).length;        
        writeLog(`[${roomName}] Job: [${jobTitle}] | ${currentCount}+${jobsInQueue}/${qtyNeeded}`, LOG_TYPE.REGULAR);
        
        // Check how many jobs need to be filled
        let plannedJobs = currentCount + jobsInQueue;
        if (plannedJobs < qtyNeeded) {
            for (let i = plannedJobs; i < qtyNeeded; i++) {
                writeLog(`[${roomName}] Adding [${jobTitle}] to queue...`, LOG_TYPE.INFORMATION);
                creepQueue.push(jobTitle);
            }
        }
	}

    writeLog(`[${roomName}] Updated Queue: [${creepQueue}]`, LOG_TYPE.REGULAR);

    // Update queue in memory
    Memory.rooms[roomIndex].roomData.queues.creepQueue = creepQueue;
    writeLog(`[${roomName}] Creep Queue has been updated in memory`, LOG_TYPE.SUCCESS);

    writeLog('------------------ Finished Creep Queue mgmt -----------------\n\n', LOG_TYPE.TRIVIAL);
}

// Manages the global queue of building production
/** 
 * @param {array} buildingList
**/
function manageBuildingQueue(buildingList) {
    // Get current queue from memory
    let buildingQueue = Memory.buildingQueue;
    writeLog(buildingQueue, LOG_TYPE.INFORMATION);


}

module.exports = {
    manageCreepQueue,
    manageBuildingQueue
}