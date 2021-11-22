const { GenericException } = require('.')

class NotFoundException extends GenericException {
  constructor(message) {
    super(message, 'NotFoundException')
  }
}

module.exports = NotFoundException
