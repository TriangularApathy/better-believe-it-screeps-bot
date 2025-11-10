const { writeLog, LOG_TYPE } = require("./handler.logging");

// Manages the global queue of creep production
/** 
 * @param {array} jobList
**/
function manageCreepQueue(jobList) {
    writeLog('-------------- CREEP QUEUE MGMT --------------', LOG_TYPE.TRIVIAL);

    // Get current queue from memory
    var creepQueue = Memory.creepQueue;
    if (creepQueue === undefined) {
        creepQueue = [];
    }

    writeLog(`Current Queue: ${creepQueue}`, LOG_TYPE.INFORMATION);

    // Sort jobs by importance
    jobList = jobList.sort((a, b) => b.importance - a.importance);

    // Add missing jobs to queue
	for (let job in jobList) {
		// Get count of each job
        let jobTitle = jobList[job].jobTitle;
        let currentCount = _.filter(Game.creeps, { memory: { job: jobTitle}}).length;
        let qtyNeeded = jobList[job].qtyNeeded;
        let jobsInQueue = 0;

        try {
            jobsInQueue = creepQueue.filter(job => job == jobTitle).length;
        }   catch (error) { 
            writeLog(`Unable to filter job list: ${error}`, LOG_TYPE.ERROR);
        }
        
        writeLog(`Job: [${jobTitle}] | ${currentCount}+${jobsInQueue}/${qtyNeeded}`, LOG_TYPE.REGULAR);
        
        // Check how many jobs need to be filled
        let plannedJobs = currentCount + jobsInQueue;
        if (plannedJobs < qtyNeeded) {
            for (let i = plannedJobs; i < qtyNeeded; i++) {
                writeLog(`Adding [${jobTitle}] to queue...`, LOG_TYPE.SUCCESS);
                creepQueue.push(jobTitle);
            }
        }
	}

    // Write new queue to memory
    Memory.creepQueue = creepQueue;
    writeLog(`Updated Queue: ${creepQueue}`, LOG_TYPE.INFORMATION);
    writeLog('------------ END CREEP QUEUE MGMT ------------\n\n', LOG_TYPE.TRIVIAL);
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