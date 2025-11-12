module.exports.loop = function () {
	// -------------------- Start Module Imports --------------------

	// Import jobs
	var job_Harvester = require('job.harvester');
	var job_Guard = require('job.guard');
	var job_Upgrader = require('job.upgrader');
	var job_Builder = require('job.builder');

	// Import logic
	const { LOG_TYPE, writeLog } = require('./handler.logging');
	const { initializeRoom } = require('./handler.rooms');
	var handler_JobCost = require('handler.job-cost');
	const { handler_Spawning } = require('./handler.spawning');
	const { manageCreepQueue, manageBuildingQueue } = require('./handler.queue');

	// --------------------- End Module Imports ---------------------

	writeLog('===================== STARTING MAIN LOOP =====================', LOG_TYPE.TRIVIAL);

	// ----------------------- Start Cleanup ------------------------
	
	writeLog('---------------------- Starting Cleanup ----------------------', LOG_TYPE.TRIVIAL);

	// Remove dead creeps from memory
	for(let name in Memory.creeps) {
		if(!Game.creeps[name]) {
			delete Memory.creeps[name];
			writeLog(`Rip in pieces [${name}]`);
		}
	}

	writeLog('---------------------- Finished Cleanup ----------------------\n\n', LOG_TYPE.TRIVIAL);

	// ------------------------ End Cleanup -------------------------

	// ------------------- Start Global Variables -------------------
	
	// Define current room
	var currentRoom = "W9N6";

	// Define allies
	Memory.allies = [
		{
			name: '-Cray-',
			category: 'friends',
			notes: ''
		},
		{
			name: 'TEMPLE',
			category: 'friends',
			notes: ''
		}
	];

	// Define global jobs
	var jobs = [
		{
			// Harvesters used to gather materials
			jobTitle: "Harvester",
			minQty: 2,
			maxQty: 8,
			current: undefined,
			importance: .1,
			bodyParts: [
				WORK, CARRY, CARRY, MOVE, MOVE
			],
			cost: undefined
		},
		{
			// Guards defend the base
			jobTitle: "Guard",
			minQty: 0,
			maxQty: 0,
			current: undefined,
			importance: 0.5,
			bodyParts: [
				MOVE, MOVE, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH
			]
		},
		{
			// Guards defend the base
			jobTitle: "Upgrader",
			minQty: 0,
			maxQty: 3,
			current: undefined,
			importance: 0.2,
			bodyParts: [
				WORK, CARRY, CARRY, MOVE, MOVE
			]
		}
		
	];

	// -------------------- End Global Variables --------------------

	// ---------------------- Start Room MGMT -----------------------

	writeLog('------------------ Starting Room Management ------------------', LOG_TYPE.TRIVIAL);

	// FOR TESTING MEMORY ISSUES
	//delete Memory.rooms;

	// Check if room memory exists, if not initialize it
	if (!Memory.rooms) { 
		writeLog(`Initializing room memory`, LOG_TYPE.INFORMATION);
		Memory.rooms = []; 
	}

	// Get all spawns
	let spawns = Game.spawns;

	// Check to see if spawner rooms exist in memory, if not initialize it
	for (let spawn in spawns) {
		let roomName = spawns[spawn].room.name;
		if (!Memory.rooms.find(room => room.roomName === roomName)) {
			writeLog(`[${roomName}] Initializing room`, LOG_TYPE.INFORMATION);
			initializeRoom(roomName);
		}
		else { writeLog(`[${roomName}] Room already initialized`, LOG_TYPE.REGULAR); }
	}

	writeLog('------------------ Finished Room Management ------------------\n\n', LOG_TYPE.TRIVIAL);

	// ----------------------- End Room MGMT ------------------------

	// Perform actions on each room
	for (let room of Memory.rooms) {
		let roomName = room.roomName;

		// ---------------------- Start Tier MGMT -----------------------

		writeLog('-------------------- Starting Room Actions -------------------', LOG_TYPE.TRIVIAL);
		writeLog('------------------ Starting Tier Management ------------------', LOG_TYPE.TRIVIAL);

		// Loop through rooms to update tiers as needed
		writeLog(`[${roomName}] Checking tier details...`, LOG_TYPE.INFORMATION);

		// Define current controller tier
		var startingTier = Game.rooms[roomName].controller.level;
		var operatingTier = startingTier;
		writeLog(`[${roomName}] Current tier: [${operatingTier}]`);

		// Check if current tier has been set up and run at lower tier if not
		let tiers = room.roomData.tiers;
		for (let tier in tiers) {
			if (tiers[operatingTier]) { break; }
			else {
				writeLog(`[${roomName}] Tier has not been defined. Checking next tier...`, LOG_TYPE.WARNING);
				operatingTier--;
			}
		}
		
		if( startingTier - operatingTier > 1) { writeLog(`[${roomName}] Currently operating [${startingTier - operatingTier}] tiers lower`, LOG_TYPE.ALERT) }
		else { writeLog(`[${roomName}] Currently operating [${startingTier - operatingTier}] tier lower`, LOG_TYPE.ALERT) }

		// Update tier information in memory
		room.currentTier = startingTier;
		room.operatingTier = operatingTier;

		writeLog(`[${roomName}] Tiers updated`, LOG_TYPE.SUCCESS);

		writeLog('------------------ Finished Tier Management ------------------\n\n', LOG_TYPE.TRIVIAL);

		// ----------------------- End Tier MGMT ------------------------

		// --------------------- Start Queue MGMT -----------------------

		writeLog('-------------------- Starting Queue MGMT ---------------------', LOG_TYPE.TRIVIAL);

		manageCreepQueue(roomName);
		//manageBuildingQueue(roomName);

		
		writeLog('-------------------- Finished Queue MGMT ---------------------\n\n', LOG_TYPE.TRIVIAL);

		// ---------------------- End Queue MGMT ------------------------
		
		writeLog('-------------------- Finished Room Actions -------------------\n\n', LOG_TYPE.TRIVIAL);
	}

	// Save operating tier, job list, and structure list to memory
	//Memory.operatingTier = operatingTier;
	//Memory.jobList = tiers[operatingTier].jobs;
	//Memory.structureList = tiers[operatingTier].buildings;

	// Get count of each job
	for (var job in jobs) {
		jobs[job].current = _.filter(Game.creeps, { memory: { job: jobs[job].jobTitle}}).length;
	}

	// sort by weighted importance
 	//console.log(`Sorted Job List: ${JSON.stringify(jobs, null, 2)}`);

	// Spawn creeps
	writeLog('---------- Starting Spawaning Creeps ----------', LOG_TYPE.TRIVIAL);
	for (let job in jobs) {
		let jobTitle = jobs[job].jobTitle;
		let minQty = jobs[job].minQty;
		let maxQty = jobs[job].maxQty;
		let currentJobCount = jobs[job].current;
		let bodyParts = jobs[job].bodyParts;
		let jobCost = handler_JobCost.run(bodyParts);

		writeLog(`[${jobTitle}]: ${minQty}|${currentJobCount}|${maxQty}`);

		for(let i in Game.spawns) {
			let energyTotal = Game.rooms[currentRoom].energyAvailable;
			writeLog(`Current Energy: ${energyTotal}`);
			if(
				currentJobCount < maxQty
				&& energyTotal >= jobCost
			) {
				let creepName = `${jobTitle}_${Date.now()}`;
				writeLog(`Spawning ${jobTitle}...`, LOG_TYPE.INFORMATION);
				Game.spawns[i].spawnCreep(bodyParts, creepName, { memory: { job: jobTitle } });
				jobs[job].current++;
				writeLog(`${creepName} spawned at [${Game.spawns[i].name}]`, LOG_TYPE.SUCCESS);
			}
			else {writeLog('No creeps spawned...', LOG_TYPE.INFORMATION);}
		}	
	}
	writeLog('---------- Finished Spawning Creeps ----------\n\n', LOG_TYPE.TRIVIAL);

	// Tell each creep what to do
    for(let j in Game.creeps) {
		let creep = Game.creeps[j];
		//writeLog(`Creep: [${creep}] | Job: [${creep.memory.job}]`);
        switch(creep.memory.job) {
			case 'Harvester': {
				//writeLog(`${creep} is going to do job [Harvester]`)
				job_Harvester.run(creep);
				break;
			}
			case 'Guard': {
				//writeLog(`${creep} is going to do job [Guard]`)
				job_Guard.run(creep, currentRoom);
				break;
			}
			case 'Upgrader': {
				job_Upgrader.run(creep);
				break;
			}
			case 'Builder': {
				job_Builder.run(creep, operatingTier);
				break;
			}
		}
    }

	writeLog('===================== FINISHED MAIN LOOP =====================\n\n', LOG_TYPE.TRIVIAL);
}