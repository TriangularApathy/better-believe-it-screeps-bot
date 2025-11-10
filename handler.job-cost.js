var handler_jobCost = {
    
    /** @param {array} bodyParts **/
    run: function(bodyParts) {
        let cost = 0;
        for (let i in bodyParts) {
            cost += BODYPART_COST[bodyParts[i]]
        }
        return cost;
	}
};

module.exports = handler_jobCost;