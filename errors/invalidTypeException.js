/**
 * Error used when an type is invalid.
 */
class InvalidTypeException extends Error {
  constructor(paramName, paramType) {
    super(
      `The "${paramName}" parameter must be of the "${paramType}" type, or not is an valid object`
    )
  }
}

module.exports = InvalidTypeException
