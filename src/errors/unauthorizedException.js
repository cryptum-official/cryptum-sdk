/**
 * Error used when an api response contains 401 code.
 */
class UnauthorizedException extends Error {
  constructor() {
    super(
      'You don\'t have permission or didn\'t provide the correct credentials'
    )
  }
}

module.exports = UnauthorizedException
