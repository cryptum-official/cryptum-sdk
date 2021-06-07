/**
 * Error used when an an entity not can mount an object using data provided.
 */
class NotCanMountException extends Error {
  constructor(entityName) {
    super(`Not can mount ${entityName} entity`)
  }
}

module.exports = NotCanMountException
