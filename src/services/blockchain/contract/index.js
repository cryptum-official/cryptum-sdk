const { handleRequestError, getApiMethod, mountHeaders } = require('../../../services')
const requests = require('./requests.json')

const compileContract = async ({
  protocol, config,
  source, contractName, tokenType,
}) => {
  try {
    const apiRequest = getApiMethod({
      requests,
      key: 'compileContract',
      config,
    })
    const data = {}
    const headers = mountHeaders(config.apiKey)

    if (source) data.source = source
    if (contractName) data.contractName = contractName
    if (tokenType) data.tokenType = tokenType

    const response = await apiRequest(`${requests.compileContract.url}?protocol=${protocol}`, data, {
      headers,
    })

    return response.data;
  } catch (error) {
    handleRequestError(error)
  }
};

module.exports = {
  compileContract,
};