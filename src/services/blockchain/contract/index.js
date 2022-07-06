const { handleRequestError, makeRequest } = require('../../../services');
const { SUPPORTS_INTERFACE_ABI } = require('../eth/abis');

const compileContract = async ({ protocol, config, source, contractName, tokenType, params }) => {
  try {
    const data = {}
    if (source) data.source = source
    if (contractName) data.contractName = contractName
    if (tokenType) data.tokenType = tokenType
    if (params) data.params = params

    return await makeRequest({ url: `/transaction/contract/compile?protocol=${protocol}`, method: 'post', config })
  } catch (error) {
    handleRequestError(error)
  }
};

const supportsERC721 = async ({ protocol, contractAddress, config }) => {
  try {
    const { result } = await makeRequest({
      url: `/tx/call-method?protocol=${protocol}`,
      method: 'post',
      body: {
        contractAbi: SUPPORTS_INTERFACE_ABI,
        contractAddress,
        method: 'supportsInterface',
        params: ['0x80ac58cd']
      },
      config
    })
    return result
  } catch (error) {
    handleRequestError(error)
  }
}

module.exports = {
  compileContract,
  supportsERC721
};