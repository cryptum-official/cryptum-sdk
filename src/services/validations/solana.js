const { GenericException } = require("../../errors")
const InvalidException = require("../../errors/InvalidException")

module.exports.validateSolanaNFTMetadata = ({
  name,
  symbol,
  seller_fee_basis_points,
  description,
  image,
  animation_url,
  external_url,
  attributes,
  collection,
  properties,
}) => {
  if (!name || typeof name !== 'string') {
    throw new GenericException('Invalid name for the NFT.', 'InvalidTypeException')
  }
  if (symbol && typeof symbol !== 'string') {
    throw new GenericException('Invalid NFT symbol, expected string.', 'InvalidTypeException')
  }
  if (seller_fee_basis_points && typeof seller_fee_basis_points !== 'number') {
    throw new GenericException('Invalid seller_fee_basis_points type, expected number.', 'InvalidTypeException')
  }
  if (description && typeof description !== 'string') {
    throw new GenericException('Invalid description type, expected string.', 'InvalidTypeException')
  }
  if (image && typeof image !== 'string') {
    throw new GenericException('Invalid image type, expected string.', 'InvalidTypeException')
  }
  if (animation_url && typeof animation_url !== 'string') {
    throw new GenericException('Invalid animation_url type, expected string.', 'InvalidTypeException')
  }
  if (external_url && typeof external_url !== 'string') {
    throw new GenericException('Invalid external_url type, expected string.', 'InvalidTypeException')
  }
  if (collection && typeof collection !== 'object') {
    throw new GenericException('Invalid collection type, expected an object.', 'InvalidTypeException')
  }
  if (properties && typeof properties !== 'object') {
    throw new GenericException('Invalid properties type, expected an array of objects.', 'InvalidTypeException')
  }
  if (attributes && typeof attributes !== 'object') {
    throw new GenericException('Invalid attributes type, expected an array of objects.', 'InvalidTypeException')
  }
}

module.exports.validateSolanaTransferTransaction = (
  { wallet, destination, token, amount }
) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet.', 'InvalidTypeException')
  }
  if (destination && typeof destination !== 'string') {
    throw new GenericException('Invalid destination, expected string.', 'InvalidTypeException')
  }
  if (!token || typeof token !== 'string') {
    throw new GenericException('Invalid token type, expected string.', 'InvalidTypeException')
  }
  if (!amount || typeof amount !== 'string') {
    throw new GenericException('Invalid amount type, expected string.', 'InvalidTypeException')
  }
}

module.exports.validateSolanaDeployTransaction = (
  { wallet, destination, fixedSupply, decimals, amount, network }
) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet.', 'InvalidTypeException')
  }
  if (destination && typeof destination !== 'string') {
    throw new GenericException('Invalid destination, expected string.', 'InvalidTypeException')
  }
  if (typeof fixedSupply !== 'boolean') {
    throw new GenericException('Invalid fixedSupply type, expected boolean.', 'InvalidTypeException')
  }
  if (!amount || typeof amount !== 'string') {
    throw new GenericException('Invalid amount type, expected string.', 'InvalidTypeException')
  }
  if (!decimals || typeof decimals !== 'number') {
    throw new GenericException('Invalid decimals type, expected string.', 'InvalidTypeException')
  }
  if (network && typeof network !== 'string') {
    throw new GenericException('Invalid network type, expected string.', 'InvalidTypeException')
  }
}

module.exports.validateSolanaDeployNFT = (
  { wallet, maxSupply, uri, network, masterEdition, token }
) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet.', 'InvalidTypeException')
  }
  if (maxSupply && typeof maxSupply !== 'number') {
    throw new GenericException('Invalid maxSupply type, expected number.', 'InvalidTypeException')
  }
  if (uri && typeof uri !== 'string') {
    throw new GenericException('Invalid uri type, expected string.', 'InvalidTypeException')
  }
  if (network && typeof network !== 'string') {
    throw new GenericException('Invalid network type, expected string.', 'InvalidTypeException')
  }
  if (masterEdition && typeof masterEdition !== 'string') {
    throw new GenericException('Invalid masterEdition type, expected string.', 'InvalidTypeException')
  }
  if (token && typeof token !== 'string') {
    throw new GenericException('Invalid token type, expected string.', 'InvalidTypeException')
  }
}

module.exports.validateSolanaCustomProgramInput = (
  { wallet, keys, programId, data }
) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet.', 'InvalidTypeException')
  }
  if (!keys || typeof keys !== 'object') {
    throw new GenericException('Invalid keys type, expected an array of objects.', 'InvalidTypeException')
  }
  if (!programId) {
    throw new GenericException('Invalid programId.', 'InvalidTypeException')
  }
  if (!data || typeof data !== 'object') {
    throw new GenericException('Invalid network type, expected a buffer.', 'InvalidTypeException')
  }
}
module.exports.validateSolanaCollectionInput = ({ wallet, name, symbol, uri }) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!name || typeof name !== 'string') {
    throw new InvalidException('Invalid name')
  }
  if (!symbol || typeof symbol !== 'string') {
    throw new InvalidException('Invalid symbol')
  }
  if (!uri || typeof uri !== 'string') {
    throw new InvalidException('Invalid uri')
  }
}
module.exports.validateSolanaNFTInput = ({ wallet, maxSupply, uri, name, symbol, creators, royaltiesFee, collection }) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!name || typeof name !== 'string') {
    throw new InvalidException('Invalid name')
  }
  if (!symbol || typeof symbol !== 'string') {
    throw new InvalidException('Invalid symbol')
  }
  if (!uri || typeof uri !== 'string') {
    throw new InvalidException('Invalid uri')
  }
  if (isNaN(maxSupply)) {
    throw new InvalidException('Invalid maxSupply')
  }
  if (collection && typeof uri !== 'string') {
    throw new InvalidException('Invalid collection')
  }
  if (creators && !Array.isArray(creators)) {
    throw new InvalidException('Invalid creators')
  }
  if (royaltiesFee !== undefined && isNaN(royaltiesFee)) {
    throw new InvalidException('Invalid royaltiesFee')
  }
}