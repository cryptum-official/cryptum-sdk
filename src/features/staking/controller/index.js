const CeloStakingController = require('./celo');
const Interface = require('./interface');

class StakingController extends Interface {

	celo() {
		return new CeloStakingController(this.config)
	}
}

module.exports = StakingController