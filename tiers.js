const tierList = [
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
                qtyNeeded: 0,
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
                qtyNeeded: 0,
                importance: 1.0,
                bodyParts: [
                    WORK, WORK, CARRY, MOVE
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
                qtyNeeded: 2,
                importance: 0.7,
                bodyParts: [
                    CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE
                ]
            },
            {
                // Protects room
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
                qtyMax: 5,
                importance: 1.0
            },
            {
                buildingName: 'Extension',
                qtyMax: 5,
                importance: 0.8
            },
            {
                buildingName: 'Wall',
                qtyMax: undefined,
                importance: 0.5
            },
            {
                buildingName: 'Rampart',
                qtyMax: undefined,
                importance: 0.4
            }
        ]
    }
]

module.exports = {
    tierList
}