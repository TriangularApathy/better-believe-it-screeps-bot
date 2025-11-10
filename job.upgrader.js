var job_Upgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getUsedCapacity() == 0) {
            var closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if(creep.withdraw(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSpawn);
            }
        }
        else {
            if(creep.room.controller) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
	}
};

module.exports = job_Upgrader;