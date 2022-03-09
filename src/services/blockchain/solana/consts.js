const metaplex = require('@metaplex/js');
const solanaWeb3 = require('@solana/web3.js');

const MAX_RETRIES = 24

class AmountRange {
  amount;
  length;
  constructor(args) {
    this.amount = args.amount;
    this.length = args.length;
  }
}
class ParticipationStateV2 {
  collectedToAcceptPayment = new BN(0);

  constructor(args) {
    Object.assign(this, args);
  }
}
class ParticipationConfigV2 {
  winnerConstraint = 0;
  nonWinningConstraint = 1;
  fixedPrice = new BN(0);
  constructor(args) {
    Object.assign(this, args);
  }
}
class SafetyDepositConfig {
  key;
  auctionManager;
  order;
  winningConfigType;
  amountType;
  lengthType;
  amountRanges;
  participationConfig;
  participationState;
  constructor(args) {
    Object.assign(this, args)
  };
}


class ValidateSafetyDepositBoxV2Args {
  instruction = 18;
  safetyDepositConfig;
  constructor(safetyDeposit) {
    this.safetyDepositConfig = safetyDeposit;
  }
}

function toPublicKey(key) {
  return new solanaWeb3.PublicKey(key)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function metaplexConfirm(network, tx) {
  let confirmedTx = null
  for (let tries = 0; tries < MAX_RETRIES; tries++) {
    confirmedTx = await new metaplex.Connection(network, "finalized").getTransaction(tx)
    if (confirmedTx) break
    await sleep(1000)
  }
  if (!confirmedTx) throw new Error("Could not find requested transaction")
}

const SAFETY_DEPOSIT_BOX_SCHEMA = new Map([
  [
    SafetyDepositConfig,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['auctionManager', 'pubkeyAsString'],
        ['order', 'u64'],
        ['winningConfigType', 'u8'],
        ['amountType', 'u8'],
        ['lengthType', 'u8'],
        ['amountRanges', [AmountRange]],
        [
          'participationConfig',
          { kind: 'option', type: ParticipationConfigV2 },
        ],
        ['participationState', { kind: 'option', type: ParticipationStateV2 }],
      ],
    },
  ],
  [
    ValidateSafetyDepositBoxV2Args,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['safetyDepositConfig', SafetyDepositConfig],
      ],
    },
  ],
  [
    AmountRange,
    {
      kind: 'struct',
      fields: [
        ['amount', 'u64'],
        ['length', 'u64'],
      ],
    },
  ]
]);

class SetAuthorityArgs {
  instruction = 5;
}

class WhitelistedCreator {
  key = 4;
  address;
  activated = true;

  constructor(args) {
    this.address = args.address;
    this.activated = args.activated;
  }
}

class SetWhitelistedCreatorArgs {
  instruction = 9;
  activated;
  constructor(args) {
    this.activated = args.activated;
  }
}

const AUCTION_SCHEMA = new Map([
  [
    SetAuthorityArgs,
    {
      kind: 'struct',
      fields: [['instruction', 'u8']],
    },
  ]
]);

const WHITELIST_CREATOR_SCHEMA = new Map([
  [
    WhitelistedCreator,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['address', 'pubkeyAsString'],
        ['activated', 'u8'],
      ],
    },
  ],
  [
    SetWhitelistedCreatorArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['activated', 'u8'],
      ],
    },
  ]
])

module.exports = {
  MAX_RETRIES,
  AUCTION_SCHEMA,
  AmountRange,
  SAFETY_DEPOSIT_BOX_SCHEMA,
  SafetyDepositConfig,
  SetAuthorityArgs,
  SetWhitelistedCreatorArgs,
  ValidateSafetyDepositBoxV2Args,
  WHITELIST_CREATOR_SCHEMA,
  toPublicKey,
  metaplexConfirm
}