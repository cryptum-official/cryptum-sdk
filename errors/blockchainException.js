const GenericException = require('./genericException')

class HathorException extends GenericException {
  constructor(message) {
    super(message, 'HATHOR_EXCEPTION')
  }
}

module.exports = { HathorException }
