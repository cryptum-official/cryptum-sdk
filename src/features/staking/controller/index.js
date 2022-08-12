module.exports.getStakingControllerInstance = (config) => new StakingController(config)
const CeloStakingController = require('./celo');
const Interface = require('./interface');

class StakingController extends Interface {

	get celo() {
		return new CeloStakingController(this.config)
	}
}

module.exports.StakingController = StakingController