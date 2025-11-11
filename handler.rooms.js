const { writeLog, LOG_TYPE } = require("./handler.logging");

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

    writeLog(`Resource has [${harvestSpots.length}] harvest spots`, LOG_TYPE.REGULAR);
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
        roomData: {
            creeps: [],
            buildings: [],
            sources: [],
            minerals: []
        }
    };

    // ------------------ Start Defining Resources ------------------
    
    // Define sources in the room
    var sources = Game.rooms[roomName].find(FIND_SOURCES);

    for (let source of sources) {
        writeLog(`Adding source [${source.id}] to room [${roomName}]`, LOG_TYPE.INFORMATION);
        newRoom.roomData.sources.push(
            {
                id: source.id,
                resourceType: 'Energy',
                resourceCapacity: source.energyCapacity,
                pos: { 
                    x: source.pos.x,
                    y: source.pos.y
                },
                harvestSpots: getHarvestSpots(source.pos.x, source.pos.y, roomName)
            }
        );
    }

    writeLog(`Finished adding sources [${roomName}]`, LOG_TYPE.SUCCESS);
    
    // Define minerals in the room
    var minerals = Game.rooms[roomName].find(FIND_MINERALS);

    for (let mineral of minerals) {
        writeLog(`Adding mineral [${mineral.id}] to room [${roomName}]`, LOG_TYPE.INFORMATION);
        newRoom.roomData.minerals.push(
            {
                id: mineral.id,
                resourceType: mineral.mineralType,
                resourceCapacity: mineral.mineralAmount,
                pos: { 
                    x: mineral.pos.x,
                    y: mineral.pos.y
                },
                harvestSpots: getHarvestSpots(mineral.pos.x, mineral.pos.y, roomName)
            }
        );
    }

    writeLog(`Finished adding minerals [${roomName}]`, LOG_TYPE.SUCCESS);

    // Save new room to memory
    Memory.rooms.push(newRoom);

    writeLog(`Finished initializing room [${roomName}]`, LOG_TYPE.SUCCESS);

    // ------------------- End Defining Resources -------------------
}

module.exports = {
    initializeRoom
}