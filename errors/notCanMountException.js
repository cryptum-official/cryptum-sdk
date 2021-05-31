class NotCanMountException extends Error {
  constructor(entityName) {
    super(`Not can mount ${entityName} entity`)
  }
}

module.exports = NotCanMountException
