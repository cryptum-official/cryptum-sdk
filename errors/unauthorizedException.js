/**
 * Error used when an api response contains 401 code.
 */
class UnauthorizedException extends Error {
  constructor() {
    super(
      'You dont have permission or not provided correct credentials or token'
    )
  }
}

module.exports = UnauthorizedException
