var job_Guard = {

    /** @param {Creep} creep **/
    run: function(creep, room) {
        let targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length > 0) {
            // Filter out allies
            let hostiles = targets.filter(hostileCreep => !Memory.allies.some(ally => ally.name === hostileCreep.owner.username));
            
            // Attack the hostile
            if (hostiles.length > 0) {
                let target = hostiles[0];
                console.log(`TARGET: ${target}`);
                creep.memory.intent = 'Attack';
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    creep.memory.action = 'Moving'
                }
                else { creep.memory.action = 'Attacking'; }
            }

            /*
            // Guard exits
            else {
                let exits = Game.map.describeExits(room);
                console.log(exits[1]);
                for (let i in exits) {
                    let guardCountMax = 1;
                    if (_.filter (Game.creeps, { memory: { assignedExit: exits[i] }}) < guardCountMax) {
                        creep.memory.assignedExit = exits[i];
                        console.log (`${creep} in ${room} moving to ${exits[i]}`);
                        creep.moveTo(exits[i]);
                        break;
                    }
                }
            }            
            */

            /*
            // Attack invader spot
            else {
                let targetRoom = 'W4N6';
                if (creep.room != targetRoom) {
                    let exitDirection = Game.map.findExit(creep.room, targetRoom);
                    let exit = creep.pos.findClosestByRange(exitDirection);
                    creep.moveTo(exit);
                    console.log (`${creep} in ${room} moving to ${targetRoom} via ${exit}`);
                }
            }
            */
        }

        // Guard Key areas
        else {
            //console.log('Creep is going to move...');
            creep.moveTo(27, 41);
        }
	}
};

module.exports = job_Guard;