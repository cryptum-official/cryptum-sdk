module.exports.buildOperation = (
  unspents,
  address,
  outputs,
  fee = 200000
) => {

  const totalBalance = unspents
    .map((output) => output.value)
    .reduce((prev, cur) => (prev) + (cur), (0))

  let tokenBalanceMap = {}
  unspents.map((output) => {
    if (output.metadata) {
      output.metadata[`${output.txHash}:${output.index}`].map((policy) => {
        if (!tokenBalanceMap[policy.policyId]) {
          tokenBalanceMap[policy.policyId] = {}
        }
        policy.tokens.map((token) => {
          if (tokenBalanceMap[policy.policyId][token.currency.symbol]) {
            tokenBalanceMap[policy.policyId][token.currency.symbol] = (Number(tokenBalanceMap[policy.policyId][token.currency.symbol]) + Number(token.value)).toString()
          } else {
            tokenBalanceMap[policy.policyId][token.currency.symbol] = token.value
          }
        })
      })
    }
  })

  let tokenBundle = [];

  const inputs = unspents.map((coin, index) => {
    const operation = {
      operation_identifier: {
        index,
        network_index: 0,
      },
      related_operations: [],
      type: "input",
      status: "success",
      account: {
        address,
        metadata: {},
      },
      amount: {
        value: coin.value * 10 ** 6,
        currency: {
          symbol: "ADA",
          decimals: 6,
        },
        metadata: {},
      },
      coin_change: {
        coin_identifier: {
          identifier: `${coin.txHash}:${coin.index}`
        },
        coin_action: "coin_created",
      },
      metadata: {},
    };
    if (coin.metadata) {
      const coinsWithMa = Object.keys(coin.metadata);
      const coinTokenBundleItems = coinsWithMa.reduce(
        (tokenBundleList, coinWithMa) => {
          const tokenBundleItems = coin.metadata[coinWithMa];
          return tokenBundleList.concat(tokenBundleItems);
        },
        []
      );
      tokenBundle.push(...coinTokenBundleItems);
      operation.metadata = { tokenBundle };
    }
    operation.amount.value = `-${operation.amount.value}`;
    return operation;
  });


  let tokensToBeSpent = {}
  const outputOp = outputs.map((output) => {
    let op
    if (!output.token) {
      op =
      {
        operation_identifier: {
          index: inputs.length,
          network_index: 0,
        },
        related_operations: [],
        type: "output",
        status: "success",
        account: {
          address: output.address,
          metadata: {},
        },
        amount: {
          value: BigInt(Number(output.amount) * 1000000).toString(),
          currency: {
            symbol: "ADA",
            decimals: 6,
          },
          metadata: {},
        },
        metadata: {},
      }
    }
    else {
      try { BigInt(output.token.amount) } catch (e) { throw new Error('Native token amount must be an integer') }
      if (tokensToBeSpent[output.token.policy]) {
        if (tokensToBeSpent[output.token.policy][output.token.asset]) {
          tokensToBeSpent[output.token.policy][output.token.asset] = (Number(tokensToBeSpent[output.token.policy][output.token.asset]) + Number(output.token.amount)).toString()
        } else {
          tokensToBeSpent[output.token.policy][output.token.asset] = output.token.amount
        }
      } else {
        tokensToBeSpent[output.token.policy] = {}
        if (tokensToBeSpent[output.token.policy][output.token.asset]) {
          tokensToBeSpent[output.token.policy][output.token.asset] = (Number(tokensToBeSpent[output.token.policy][output.token.asset]) + Number(output.token.amount)).toString()
        } else {
          tokensToBeSpent[output.token.policy][output.token.asset] = output.token.amount
        }
      }
      op = {
        operation_identifier: {
          index: inputs.length,
          network_index: 0,
        },
        related_operations: [],
        type: "output",
        status: "success",
        account: {
          address: output.address,
          metadata: {},
        },
        amount: {
          value: BigInt(Number(output.amount) * 1000000).toString(),
          currency: {
            symbol: "ADA",
            decimals: 6,
          },
          metadata: {},
        },
        metadata: {
          tokenBundle: [{
            policyId: output.token.policy,
            tokens: [{
              value: output.token.amount,
              currency: {
                symbol: output.token.asset,
                decimals: 0,
                metadata: {
                  policyId: output.token.policy
                }
              }
            }]
          }]
        },
      }
    }
    return op
  })

  const leftoverAdaAmount =
    BigInt(totalBalance * 1000000)
    - BigInt(outputs.reduce((prev, cur) => prev + Number(cur.amount), 0) * 1000000)
    - BigInt(fee)

  const leftoverOp = {
    operation_identifier: {
      index: inputs.length,
      network_index: 0,
    },
    related_operations: [],
    type: "output",
    status: "success",
    account: {
      address,
      metadata: {},
    },
    amount: {
      value: leftoverAdaAmount.toString(),
      currency: {
        symbol: "ADA",
        decimals: 6,
      },
      metadata: {},
    },
    metadata: {},
  };

  const isAdaOnly = outputs.filter((out) => out.token).length === 0
  if (tokenBundle.length > 0 && isAdaOnly) leftoverOp.metadata = { tokenBundle };
  if (!isAdaOnly) {
    try {
      tokenBundle.map((policy, pix) => {
        policy.tokens.map((token, tix) => {
          if (tokensToBeSpent[policy.policyId][token.currency.symbol]) {
            tokenBundle[pix].tokens[tix].value = (Number(tokenBundle[pix].tokens[tix].value) - Number(tokensToBeSpent[policy.policyId][token.currency.symbol])).toString()
          }
        })
      })
      leftoverOp.metadata = { tokenBundle }
    } catch (error) {
      throw new Error('Provided token arguments cannot be found in this wallet')
    }
  }

  const outputsArr = outputOp.concat(leftoverOp);
  return {
    operations: inputs.concat(outputsArr),
  };
};

module.exports.buildOperationFromInputs = (
  unspents,
  outputs,
) => {

  let tokenBalanceMap = {}
  unspents.map((output) => {
    if (output.metadata) {
      output.metadata[`${output.txHash}:${output.index}`].map((policy) => {
        if (!tokenBalanceMap[policy.policyId]) {
          tokenBalanceMap[policy.policyId] = {}
        }
        policy.tokens.map((token) => {
          if (tokenBalanceMap[policy.policyId][token.currency.symbol]) {
            tokenBalanceMap[policy.policyId][token.currency.symbol] = (Number(tokenBalanceMap[policy.policyId][token.currency.symbol]) + Number(token.value)).toString()
          } else {
            tokenBalanceMap[policy.policyId][token.currency.symbol] = token.value
          }
        })
      })
    }
  })

  let tokenBundle = [];

  const inputs = unspents.map((coin, index) => {
    const operation = {
      operation_identifier: {
        index,
        network_index: 0,
      },
      related_operations: [],
      type: "input",
      status: "success",
      account: {
        address: coin.address,
        metadata: {},
      },
      amount: {
        value: coin.value * 10 ** 6,
        currency: {
          symbol: "ADA",
          decimals: 6,
        },
        metadata: {},
      },
      coin_change: {
        coin_identifier: {
          identifier: `${coin.txHash}:${coin.index}`
        },
        coin_action: "coin_created",
      },
      metadata: {},
    };
    if (coin.metadata) {
      const coinsWithMa = Object.keys(coin.metadata);
      const coinTokenBundleItems = coinsWithMa.reduce(
        (tokenBundleList, coinWithMa) => {
          const tokenBundleItems = coin.metadata[coinWithMa];
          return tokenBundleList.concat(tokenBundleItems);
        },
        []
      );
      tokenBundle.push(...coinTokenBundleItems);
      operation.metadata = { tokenBundle };
    }
    operation.amount.value = `-${operation.amount.value}`;
    return operation;
  });

  let tokensToBeSpent = {}
  const outputOp = outputs.map((output) => {
    let op
    if (!output.token) {
      op =
      {
        operation_identifier: {
          index: inputs.length,
          network_index: 0,
        },
        related_operations: [],
        type: "output",
        status: "success",
        account: {
          address: output.address,
          metadata: {},
        },
        amount: {
          value: BigInt(Number(output.amount) * 1000000).toString(),
          currency: {
            symbol: "ADA",
            decimals: 6,
          },
          metadata: {},
        },
        metadata: {},
      }
    }
    else {
      try { BigInt(output.token.amount) } catch (e) { throw new Error('Native token amount must be an integer') }
      if (tokensToBeSpent[output.token.policy]) {
        if (tokensToBeSpent[output.token.policy][output.token.asset]) {
          tokensToBeSpent[output.token.policy][output.token.asset] = (Number(tokensToBeSpent[output.token.policy][output.token.asset]) + Number(output.token.amount)).toString()
        } else {
          tokensToBeSpent[output.token.policy][output.token.asset] = output.token.amount
        }
      } else {
        tokensToBeSpent[output.token.policy] = {}
        if (tokensToBeSpent[output.token.policy][output.token.asset]) {
          tokensToBeSpent[output.token.policy][output.token.asset] = (Number(tokensToBeSpent[output.token.policy][output.token.asset]) + Number(output.token.amount)).toString()
        } else {
          tokensToBeSpent[output.token.policy][output.token.asset] = output.token.amount
        }
      }
      op = {
        operation_identifier: {
          index: inputs.length,
          network_index: 0,
        },
        related_operations: [],
        type: "output",
        status: "success",
        account: {
          address: output.address,
          metadata: {},
        },
        amount: {
          value: BigInt(Number(output.amount) * 1000000).toString(),
          currency: {
            symbol: "ADA",
            decimals: 6,
          },
          metadata: {},
        },
        metadata: {
          tokenBundle: [{
            policyId: output.token.policy,
            tokens: [{
              value: output.token.amount,
              currency: {
                symbol: output.token.asset,
                decimals: 0,
                metadata: {
                  policyId: output.token.policy
                }
              }
            }]
          }]
        },
      }
    }
    return op
  })

  return {
    operations: inputs.concat(outputOp),
  };
};