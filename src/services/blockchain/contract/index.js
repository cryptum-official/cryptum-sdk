const { handleRequestError, makeRequest } = require('../../../services');

const compileContract = async ({ protocol, config, source, contractName, tokenType, params }) => {
  try {
    const data = {}
    if (source) data.source = source
    if (contractName) data.contractName = contractName
    if (tokenType) data.tokenType = tokenType
    if (params) data.params = params

    return await makeRequest({ url: `/transaction/contract/compile?protocol=${protocol}`, method: 'post', body: data, config })
  } catch (error) {
    handleRequestError(error)
  }
};

module.exports = {
  compileContract,
};