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
                jobName: 'Harvester',
                qtyNeeded: Game.rooms[currentRoom].find(FIND_SOURCES).length * 2,
                importance: 1.0,
                bodyParts: [
                    WORK, CARRY, CARRY, MOVE, MOVE
                ]
            },
            {
                // Used to upgrade controller
                jobName: 'Upgrader',
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
                jobName: 'Harvester',
                qtyNeeded: Game.rooms[currentRoom].find(FIND_SOURCES).length * 4,
                importance: 1.0,
                bodyParts: [
                    WORK, CARRY, CARRY, CARRY, MOVE
                ]
            },
            {
                // Better for when containers are being used
                jobName: 'Upgrader',
                qtyNeeded: 3,
                importance: 0.8,
                bodyParts: [
                    WORK, CARRY, CARRY, CARRY, MOVE
                ]
            },
            {
                // Builds structures
                jobName: 'Builder',
                qtyNeeded: 2,
                importance: 0.9,
                bodyParts: [
                    WORK, CARRY, CARRY, MOVE, MOVE
                ]
            },
            {
                // Transfers energy between containers and structures
                jobName: 'Courier',
                qtyNeeded: Game.rooms[currentRoom].find(FIND_SOURCES).length + 1,
                importance: 0.7,
                bodyParts: [
                    CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE
                ]
            },
            {
                // Protects colony
                jobName: 'Guard',
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

var jobs = [
    {
        // Harvesters used to gather materials
        jobTitle: "Harvester",
        tiers: [
            {
                level: 1,


            },
            {
                2: {
                    
                }
            }
        ],
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