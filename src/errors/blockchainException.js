const GenericException = require('./genericException')

class BlockchainException extends GenericException {
  constructor(message) {
    super(message, 'BlockchainException')
  }
}
class HathorException extends GenericException {
  constructor(message) {
    super(message, 'HathorException')
  }
}

module.exports = { BlockchainException, HathorException }
