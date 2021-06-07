/**
 * Error used in interfaces to explicit when an developer need code a respective method
 */
class NotImplementedException extends Error {
  constructor() {
    super('Method not implemented')
  }
}

module.exports = NotImplementedException
