const GenericException = require('./genericException')

class HathorException extends GenericException {
  constructor(message) {
    super(message, 'HathorException')
  }
}

module.exports = { HathorException }
