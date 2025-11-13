const { writeLog, LOG_TYPE } = require('./handler.logging');
const { tierList } = require('./tiers');

// Get all harvestable spots around a source
/**
 * @param {int} startX
 * @param {int} startY
 * @param {string} roomName
 * @return {Array} harvestSpots
**/
function getHarvestSpots(startX, startY, roomName) {
    // Get terrain of room
    var terrain = Game.rooms[roomName].getTerrain();
    var harvestSpots = [];

    // Check all 8 surrounding spots
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            // Skip center spot
            if (x === 0 && y === 0) { continue; }
            else {
                // Check if spot is walkable
                if (terrain.get(startX + x, startY + y) != TERRAIN_MASK_WALL) {
                    // Add to harvest spots
                    harvestSpots.push(
                        {
                            x: startX + x,
                            y: startY + y
                        }
                    )
                }
            }            
        }
    }

    writeLog(`[${roomName}] Resource has [${harvestSpots.length}] harvest spots`, LOG_TYPE.REGULAR);
    return harvestSpots;
}

// Runs code when first starting a room
/** 
 * @param {string} roomName
**/
function initializeRoom(roomName) {
    // Begin building room structure
    let newRoom = {
        roomName: roomName,
        currentTier: Game.rooms[roomName].controller.level,
        operatingTier: undefined,
        roomData: {
            creeps: [],
            buildings: [],
            queues: {
                creepQueue: [],
                buildingQueue: []
            },
            sources: [],
            minerals: [],
            // Tiers allow for scaling of jobs and buildings as controller levels increase
            tiers: tierList
        }
    };

    // ------------------ Start Defining Resources ------------------
    
    // Define sources in the room
    var sources = Game.rooms[roomName].find(FIND_SOURCES);
    var totalHarvestSpots = 0;
    var totalMineralSpots = 0;

    for (let source of sources) {
        writeLog(`[${roomName}] Adding source [${source.id}] to room`, LOG_TYPE.INFORMATION);

        let harvestSpots = getHarvestSpots(source.pos.x, source.pos.y, roomName)
        totalHarvestSpots += harvestSpots.length;

        newRoom.roomData.sources.push(
            {
                id: source.id,
                resourceType: 'Energy',
                resourceCapacity: source.energyCapacity,
                pos: { 
                    x: source.pos.x,
                    y: source.pos.y
                },
                harvestSpots: harvestSpots
            }
        );
    }

    writeLog(`[${roomName}] Room has a total of [${totalHarvestSpots}] source harvest spots`, LOG_TYPE.REGULAR);
    writeLog(`[${roomName}] Finished adding sources `, LOG_TYPE.SUCCESS);
    
    // Define minerals in the room
    var minerals = Game.rooms[roomName].find(FIND_MINERALS);

    for (let mineral of minerals) {
        writeLog(`[${roomName}] Adding mineral [${mineral.id}] to room`, LOG_TYPE.INFORMATION);

        let harvestSpots = getHarvestSpots(mineral.pos.x, mineral.pos.y, roomName)
        totalMineralSpots += harvestSpots.length;

        newRoom.roomData.minerals.push(
            {
                id: mineral.id,
                resourceType: mineral.mineralType,
                resourceCapacity: mineral.mineralAmount,
                pos: { 
                    x: mineral.pos.x,
                    y: mineral.pos.y
                },
                harvestSpots: harvestSpots
            }
        );
    }

    writeLog(`[${roomName}] Room has a total of [${totalMineralSpots}] mineral harvest spots`, LOG_TYPE.REGULAR);
    writeLog(`[${roomName}] Finished adding minerals`, LOG_TYPE.SUCCESS);

    // ------------------- End Defining Resources -------------------

    // Update tiers to include total harvest spots
    for (let tier of newRoom.roomData.tiers) {
        for (let job of tier.jobs) {
            let jobTitle = job.jobTitle;
            if (jobTitle === 'Harvester') {
                job.qtyNeeded = totalHarvestSpots;
                writeLog(`[${roomName}] Setting [${jobTitle}] count needed to [${job.qtyNeeded}] for tier [${tier.level}]`, LOG_TYPE.REGULAR);
            }

            if (jobTitle === 'Courier') {
                job.qtyNeeded = totalMineralSpots + 2; // Additional couriers for helping with buildings and upgrading
                writeLog(`[${roomName}] Setting [${jobTitle}] count needed to [${job.qtyNeeded}] for tier [${tier.level}]`, LOG_TYPE.REGULAR);
            }

            if (jobTitle === 'Miner') {
                job.qtyNeeded = totalMineralSpots;
                writeLog(`[${roomName}] Setting [${jobTitle}] count needed to [${job.qtyNeeded}] for tier [${tier.level}]`, LOG_TYPE.REGULAR);
            }
        }
    }

    // Save new room to memory
    Memory.rooms.push(newRoom);

    writeLog(`[${roomName}] Finished initializing room`, LOG_TYPE.SUCCESS);
}

module.exports = {
    initializeRoom
}