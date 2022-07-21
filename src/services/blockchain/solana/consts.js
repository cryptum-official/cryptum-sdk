const metaplex = require('@metaplex/js');
const solanaWeb3 = require('@solana/web3.js');
const BN = require('bn.js');
const splToken = require("@solana/spl-token");
const buffer = require('buffer');
const { sleep } = require('../../utils');

const MAX_RETRIES = 48

class AmountRange {
  constructor(args) {
    this.amount = args.amount;
    this.length = args.length;
  }
}
class ParticipationStateV2 {

  constructor(args) {
    Object.assign(this, args);
  }
}
class ParticipationConfigV2 {
  constructor(args) {
    Object.assign(this, args);
  }
}
class SafetyDepositConfig {
  constructor(args) {
    Object.assign(this, args)
  }
}


class ValidateSafetyDepositBoxV2Args {
  constructor(safetyDeposit) {
    this.safetyDepositConfig = safetyDeposit;
  }
}

function toPublicKey(key) {
  return new solanaWeb3.PublicKey(key)
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
  ],
]);

class SetAuthorityArgs {
  constructor() {
    this.instruction = 5;
  }
}

class WhitelistedCreator {

  constructor(args) {
    this.key = 4
    this.address = args.address;
    this.activated = args.activated;
  }
}

class SetWhitelistedCreatorArgs {

  constructor(args) {
    this.instruction = 9
    this.activated = args.activated;
  }
}

class EmptyPaymentAccountArgs {

  constructor(args) {
    this.instruction = 7;
    this.winningConfigIndex = args.winningConfigIndex;
    this.winningConfigItemIndex = args.winningConfigItemIndex;
    this.creatorIndex = args.creatorIndex;
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

const EMPTY_PAYMENT_ACCOUNT_SCHEMA = new Map([
  [
    EmptyPaymentAccountArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['winningConfigIndex', { kind: 'option', type: 'u8' }],
        ['winningConfigItemIndex', { kind: 'option', type: 'u8' }],
        ['creatorIndex', { kind: 'option', type: 'u8' }],
      ],
    },
  ]
])

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

class CreateAssociatedTokenAccount extends metaplex.programs.core.Transaction {
  constructor(options, params) {
    const { feePayer } = options;
    const { associatedTokenAddress, walletAddress, splTokenMintAddress } = params;
    super(options);
    this.add(new solanaWeb3.TransactionInstruction({
      keys: [
        {
          pubkey: feePayer,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: associatedTokenAddress,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: walletAddress !== null && walletAddress !== void 0 ? walletAddress : feePayer,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: splTokenMintAddress,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: solanaWeb3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: splToken.TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      data: buffer.Buffer.from([]),
    }));
  }
}
class MintTo extends metaplex.programs.core.Transaction {
  constructor(options, params) {
    const { feePayer } = options;
    const { mint, dest, authority, amount } = params;
    super(options);
    this.add(splToken.Token.createMintToInstruction(splToken.TOKEN_PROGRAM_ID, mint, dest, authority !== null && authority !== void 0 ? authority : feePayer, [], (new BN(amount)).toNumber()));
  }
}

class CreateMint extends metaplex.programs.core.Transaction {
  constructor(options, params) {
    const { feePayer } = options;
    const { newAccountPubkey, lamports, decimals, owner, freezeAuthority } = params;
    super(options);
    this.add(solanaWeb3.SystemProgram.createAccount({
      fromPubkey: feePayer,
      newAccountPubkey,
      lamports,
      space: splToken.MintLayout.span,
      programId: splToken.TOKEN_PROGRAM_ID,
    }));
    this.add(splToken.Token.createInitMintInstruction(splToken.TOKEN_PROGRAM_ID, newAccountPubkey, decimals !== null && decimals !== void 0 ? decimals : 0, owner !== null && owner !== void 0 ? owner : feePayer, freezeAuthority !== null && freezeAuthority !== void 0 ? freezeAuthority : feePayer));
  }
}

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
  ParticipationConfigV2,
  EmptyPaymentAccountArgs,
  EMPTY_PAYMENT_ACCOUNT_SCHEMA,
  toPublicKey,
  metaplexConfirm,
  CreateAssociatedTokenAccount,
  MintTo,
  CreateMint
}