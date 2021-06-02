/**
 * Error used in interfaces to explicit when an developer need code a respective method
 */
class NotImplementedException extends Error {
  constructor() {
    super('Not implemented exception')
  }
}

module.exports = NotImplementedException
