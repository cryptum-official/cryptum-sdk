/**
 * Error used when is an generic or API response.
 */
class GenericException extends Error {
  constructor(message, code) {
    super(message)
    this.name = code
  }
}

module.exports = GenericException
