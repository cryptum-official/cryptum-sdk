class GenericException extends Error {
  constructor(code, type) {
    super(
      `An error with this code: ${code} and this type: ${type} has occurred`
    )
  }
}

module.exports = GenericException
