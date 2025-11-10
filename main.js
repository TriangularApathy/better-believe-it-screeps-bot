module.exports.loop = function () {
    // -------------------- Start Module Imports --------------------

	// Import jobs
	var job_Harvester = require('job.harvester');
	var job_Guard = require('job.guard');
	var job_Upgrader = require('job.upgrader');
	var job_Builder = require('job.builder');

	// Import logic
	const { LOG_TYPE, writeLog } = require('./handler.logging');
	var handler_JobCost = require('handler.job-cost');
	var handler_Spawns = require('handler.spawns');
	const { manageCreepQueue, manageBuildingQueue } = require('./handler.queue');

	// --------------------- End Module Imports ---------------------

	// ------------------- Start Global Variables -------------------
	
	// Define current room
	var currentRoom = "W9N6";

	// Define available haresting spots
	

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
			maxQty: 5,
			current: undefined,
			importance: 0.5,
			bodyParts: [
				MOVE, MOVE, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH
			]
		},
		{
			// Guards defend the base
			jobTitle: "Upgrader",
			minQty: 1,
			maxQty: 2,
			current: undefined,
			importance: 0.2,
			bodyParts: [
				WORK, CARRY, CARRY, MOVE, MOVE
			]
		}
		
	];

	// Define tier system
	var tiers = [
		{
			level: 0,
			jobs: [{}],
			buildings: [{}]
		},
		{
			level: 1,
			jobs: [
				{
					// Used to harvest resources
					jobTitle: 'Harvester',
					qtyNeeded: Game.rooms[currentRoom].find(FIND_SOURCES).length * 2,
					importance: 1.0,
					bodyParts: [
						WORK, CARRY, CARRY, MOVE, MOVE
					]
				},
				{
					// Used to upgrade controller
					jobTitle: 'Upgrader',
					qtyNeeded: 1,
					importance: 0.9,
					bodyParts: [
						WORK, CARRY, CARRY, MOVE, MOVE
					]
				}
			],
			buildings: [{}]
		},
		{
			level: 2,
			jobs: [
				{
					// Better for when containers are being used
					jobTitle: 'Harvester',
					qtyNeeded: Game.rooms[currentRoom].find(FIND_SOURCES).length * 4,
					importance: 1.0,
					bodyParts: [
						WORK, CARRY, CARRY, CARRY, MOVE
					]
				},
				{
					// Better for when containers are being used
					jobTitle: 'Upgrader',
					qtyNeeded: 3,
					importance: 0.8,
					bodyParts: [
						WORK, CARRY, CARRY, CARRY, MOVE
					]
				},
				{
					// Builds structures
					jobTitle: 'Builder',
					qtyNeeded: 2,
					importance: 0.9,
					bodyParts: [
						WORK, CARRY, CARRY, MOVE, MOVE
					]
				},
				{
					// Transfers energy between containers and structures
					jobTitle: 'Courier',
					qtyNeeded: Game.rooms[currentRoom].find(FIND_SOURCES).length + 1,
					importance: 0.7,
					bodyParts: [
						CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE
					]
				},
				{
					// Protects colony
					jobTitle: 'Guard',
					qtyNeeded: 3,
					importance: 0.6,
					bodyParts: [
						TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE
					]
				}
			],
			buildings: [
				{
					buildingName: 'Container',
					qtyMax: 5
				},
				{
					buildingName: 'Extension',
					qtyMax: 5
				},
				{
					buildingName: 'Wall',
					qtyMax: undefined
				},
				{
					buildingName: 'Rampart',
					qtyMax: undefined
				}
			]
		}
	];

	// -------------------- End Global Variables --------------------

	// ---------------------- Start Tier MGMT -----------------------

	// Define current controller tier
	var startingTier = Game.rooms[currentRoom].controller.level;
	var operatingTier = startingTier;
	writeLog(`Current tier: [${operatingTier}]`);
	
	// Check if current tier has been set up and run at lower tier if not
	for (let tier in tiers) {
		if (tiers[operatingTier]) { break; }
		else {
			writeLog('Tier has not been defined. Checking next tier...', LOG_TYPE.WARNING);
			operatingTier--;
		}
	}
	
	if( startingTier - operatingTier > 1) { writeLog(`Currently operating [${startingTier - operatingTier}] tiers lower`, LOG_TYPE.ALERT) }
	else { writeLog(`Currently operating [${startingTier - operatingTier}] tier lower`, LOG_TYPE.ALERT) }
	
	// Save job list to variable
	var jobList = tiers[operatingTier].jobs;

	// ----------------------- End Tier MGMT ------------------------

	// Save operating tier, job list, and structure list to memory
	//Memory.operatingTier = operatingTier;
	//Memory.jobList = tiers[operatingTier].jobs;
	//Memory.structureList = tiers[operatingTier].buildings;

	// ----------------------- Start Cleanup ------------------------
	
	// Remove dead creeps from memory
	for(let name in Memory.creeps) {
		if(!Game.creeps[name]) {
			delete Memory.creeps[name];
		}
	}

	// ------------------------ End Cleanup -------------------------

	// --------------------- Start Queue MGMT -----------------------

	manageCreepQueue(jobList);
	//manageBuildingQueue(buildingList);

	// ---------------------- End Queue MGMT ------------------------

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
}