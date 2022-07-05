const { GenericException } = require(".")

/**
 * Error used when a type is invalid.
 */
class InvalidException extends GenericException {
  constructor(message) {
    super(message, 'InvalidException')
  }
}

module.exports = InvalidException
