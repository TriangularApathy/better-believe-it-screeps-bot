var job_Harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var closestSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource);
            }
        }
        else {
            let closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if(creep.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSpawn);
            }
        }
	}
};

module.exports = job_Harvester;