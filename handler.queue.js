const { writeLog, LOG_TYPE } = require("./handler.logging");

// Gets room queue details
/**
 * @param {string} roomName - The name of the room
 * @param {string} queueType - Queue you want back (creep/building)
 * @returns {Array} Room's index and queue
 */
function getQueueDetails(roomName, queueType) {
    // Get room data from memory
    let roomIndex = Memory.rooms.findIndex(room => room.roomName === roomName);
    let roomObject = Memory.rooms[roomIndex];
    let operatingTier = roomObject.operatingTier;
    let queue = [];
    let list = [];

    // Get queue based on request
    switch (queueType) {
        case 'creep':
            // Get creep queue from memory
            queue = roomObject.roomData.queues.creepQueue;
            writeLog(`[${roomName}] Creep Queue: [${queue}]`, LOG_TYPE.REGULAR);
            list = roomObject.roomData.tiers[operatingTier].jobs;
            writeLog(`[${roomName}] Jobs being managed for this tier: [${list.length}]`);
            break;
        case 'building':
            // Get building queue from memory
            queue = roomObject.roomData.queues.buildingQueue;
            writeLog(`[${roomName}] Building Queue: [${queue}]`, LOG_TYPE.REGULAR);
            list = roomObject.roomData.tiers[operatingTier].buildings;
            writeLog(`[${roomName}] Buildings being managed for this tier: [${list.length}]`);
            break;
    
        default:
            break;
    }

    if (!queue) { queue = []; }

    // Sort list by importance
    list = list.sort((a, b) => b.importance - a.importance);

    // Send back the information
    return [roomIndex, queue, list];
}

// Manages the room queue for creep production
/** 
 * @param {string} roomName
**/
function manageCreepQueue(roomName) {
    writeLog('------------------ Starting Creep Queue mgmt -----------------', LOG_TYPE.TRIVIAL);

    //Memory.rooms[0].roomData.queues.creepQueue = [];

    // Get details about the queue and room
    let queueDetails = getQueueDetails(roomName, 'creep');
    let roomIndex = queueDetails[0];
    let creepQueue = queueDetails[1];
    let jobList = queueDetails[2];

    // Add missing jobs to queue
	for (let job in jobList) {
		// Get count of each job
        let jobTitle = jobList[job].jobTitle;
        let currentCount = _.filter(Game.creeps, { memory: { job: jobTitle}}).length; // Should go off of room memory instead
        let qtyNeeded = jobList[job].qtyNeeded;
        let jobsInQueue = creepQueue.filter(job => job === jobTitle).length;        
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
 * @param {string} roomName
**/
function manageBuildingQueue(roomName) {
    writeLog('---------------- Starting Building Queue mgmt ----------------', LOG_TYPE.TRIVIAL);

    // Get details about the queue and room
    let queueDetails = getQueueDetails(roomName, 'building');
    let roomIndex = queueDetails[0];
    let buildingQueue = queueDetails[1];
    let buildingList = queueDetails[2];

    // Add missing buildings to queue
    for (let building in buildingList) {
		// Get count of each building
        let buildingName = buildingList[building].buildingName;
        let qtyMax = buildingList[building].qtyMax;
        let currentCount = Game.rooms[roomName].find(FIND_MY_STRUCTURES).filter(structure => structure.structureType === buildingName).length;
        let constructionSites = Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).filter(site => site.structureType === buildingName).length;
        let buildingsInQueue = buildingQueue.filter(structure => structure === buildingName).length;

        // Handle buildings with undefined/unlimited placement
        if (!qtyMax) {
            writeLog(`[${roomName}] Building: [${buildingName}] | ${currentCount}+${constructionSites}+${buildingsInQueue}`);
            qtyMax = -1;
        }   else { writeLog(`[${roomName}] Building: [${buildingName}] | ${currentCount}+${constructionSites}+${buildingsInQueue}/${qtyMax}`, LOG_TYPE.REGULAR); }
        
        // Check how many jobs need to be filled
        let plannedBuildings = currentCount + constructionSites + buildingsInQueue;
        if (plannedBuildings < qtyMax) {
            for (let i = plannedBuildings; i < qtyMax; i++) {
                writeLog(`[${roomName}] Adding [${buildingName}] to queue...`, LOG_TYPE.INFORMATION);
                buildingQueue.push(buildingName);
            }
        }
	}

    writeLog(`[${roomName}] Updated Queue: [${buildingQueue}]`, LOG_TYPE.REGULAR);

    // Update queue in memory
    Memory.rooms[roomIndex].roomData.queues.buildingQueue = buildingQueue;
    writeLog(`[${roomName}] Building Queue has been updated in memory`, LOG_TYPE.SUCCESS);

    writeLog('---------------- Finished Building Queue mgmt ----------------\n\n', LOG_TYPE.TRIVIAL);
}

module.exports = {
    manageCreepQueue,
    manageBuildingQueue
}