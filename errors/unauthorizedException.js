class UnauthorizedException extends Error {
  constructor() {
    super(
      'You dont have permission or not provided correct credentials or token'
    )
  }
}

module.exports = UnauthorizedException
