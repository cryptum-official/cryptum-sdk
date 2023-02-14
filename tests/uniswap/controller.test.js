const CryptumSdk = require('../../../cryptum-sdk/index')
const { expect } = require('chai')
const nock = require('nock')
require('dotenv').config()

const apikey = process.env.CRYPTUM_API_KEY
const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: apikey,
})

describe('Uniswap Controller Test', () => {
  const protocol = 'POLYGON'
  const AtokenAddress = '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9' //t1
  const BtokenAddress = '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979' //t2
  const CtokenAddress = '0x536feD66120b2d346589c6618219B026D7dF1Bcc' //t3
  const DtokenAddress = '0x17C41Bc1962e987504a77033238fFc7C6C26895F' //t4
  const WMATICAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889' //wmatic

  describe('READ Functions', () => {
    describe('getPools', () => {
      it('should return pool fees', async () => {
        const pools = await sdk.uniswap.getPools({
          protocol,
          tokenA: AtokenAddress,
          tokenB: BtokenAddress,
        })

        expect(pools).to.eql([
          {
            poolAddress: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
            poolFee: 100,
          },
          {
            poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
            poolFee: 500,
          },
          {
            poolAddress: '0x63482dF9E3b186654750bEb2448AFA184d0DEa80',
            poolFee: 3000,
          },
          {
            poolAddress: null,
            poolFee: 10000,
          },
        ])
      })

      it('should return null pool fees (inexistent pools)', async () => {
        const pools = await sdk.uniswap.getPools({
          protocol,
          tokenA: AtokenAddress,
          tokenB: '0xd6666D2C4e00e5C0f96BC5956Fe514f0f1A4f0AB',
        })

        expect(pools).to.eql([
          {
            poolAddress: null,
            poolFee: 100,
          },
          {
            poolAddress: null,
            poolFee: 500,
          },
          {
            poolAddress: null,
            poolFee: 3000,
          },
          {
            poolAddress: null,
            poolFee: 10000,
          },
        ])
      })
    })

    describe('getPoolData', () => {
      it('should return pool data', async () => {
        const poolData = await sdk.uniswap.getPoolData({
          protocol,
          poolAddress: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
        })

        expect(poolData).to.eql({
          poolAddress: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
          fee: '100',
          token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
          token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
          liquidity: '4274664239629845711',
          tickSpacing: '1',
          slot0: {
            sqrtPriceX96: '56022262241300288188759753413',
            tick: '-6932',
            observationIndex: '1',
            observationCardinality: '10',
            observationCardinalityNext: '10',
            feeProtocol: '0',
            unlocked: true,
          },
        })
      })

      it('should fail (wrong pool address provided)', async () => {
        await expect(
          sdk.uniswap.getPoolData({
            protocol,
            poolAddress: '0x5268e5c5a755c2527f601bd58778319b4df12a4c', // wrong address
          })
        ).to.be.rejectedWith('Pool not found! Please provide a valid Pool Address.')
      })
    })

    describe('getTokenIds', () => {
      it('should return tokenIds', async () => {
        const tokenIds = await sdk.uniswap.getTokenIds({
          protocol,
          ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af',
        })

        expect(tokenIds).to.eql(['6122', '6124', '6467', '6780', '6781', '6993', '6994', '6996', '6997'])
      })

      it('should fail (wallet address without any positions)', async () => {
        await expect(
          sdk.uniswap.getTokenIds({
            protocol,
            ownerAddress: '0x2268e5c5a755c2527f601bd58778319b4df12a4c', // wallet address without any positions
          })
        ).to.be.rejectedWith('No Positions(Token IDs) found for this wallet address')
      })
    })

    describe('getPosition', () => {
      it('should return position info', async () => {
        const position = await sdk.uniswap.getPosition({
          protocol,
          tokenId: '7051',
        })

        expect(position).to.eql({
          nonce: '0',
          operator: '0x0000000000000000000000000000000000000000',
          token0: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
          token1: '0xa4F1C1DA64A29D1A8D7F72700D48826B181f0441',
          fee: '10000',
          tickLower: '75000',
          tickUpper: '76600',
          liquidity: '0',
          feeGrowthInside0LastX128: '0',
          feeGrowthInside1LastX128: '0',
          tokensOwed0: '0',
          tokensOwed1: '0',
        })
      })

      it('should fail (invalid tokenId provided)', async () => {
        await expect(
          sdk.uniswap.getPosition({
            protocol,
            tokenId: '9999999',
          })
        ).to.be.rejectedWith('Invalid token ID')
      })
    })

    describe('getPositions', () => {
      it('should return all Positions from address', async () => {
        const positions = await sdk.uniswap.getPositions({
          protocol,
          ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af',
          // ownerAddress: '0x43a51e57cC67012688568Ae4E9df164B2d5b093d',
          // poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C'
        })

        expect(positions).to.eql([
          {
            tokenId: '6122',
            token0: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
            token1: '0xa4F1C1DA64A29D1A8D7F72700D48826B181f0441',
            poolAddress: '0x24C96cF7b7eA5f722A7C7283CDA1041d6337EDbD',
            fee: '100',
            tickLower: '45000',
            tickUpper: '47007',
            liquidity: '0',
            feeGrowthInside0LastX128: '27708518981468165998716448325716',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6124',
            token0: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
            token1: '0xa4F1C1DA64A29D1A8D7F72700D48826B181f0441',
            poolAddress: '0x449CFBEBf3368E6Cf37A8a014F36EFA307E47037',
            fee: '500',
            tickLower: '52470',
            tickUpper: '53470',
            liquidity: '0',
            feeGrowthInside0LastX128: '312255096391075867605388300112420',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6467',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
            fee: '100',
            tickLower: '-9164',
            tickUpper: '-4057',
            liquidity: '0',
            feeGrowthInside0LastX128: '0',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6780',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
            fee: '500',
            tickLower: '-7990',
            tickUpper: '-5110',
            liquidity: '0',
            feeGrowthInside0LastX128: '0',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6781',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
            fee: '500',
            tickLower: '-7990',
            tickUpper: '-5110',
            liquidity: '0',
            feeGrowthInside0LastX128: '8519556846084454442949710601260011',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '16398984956330600875554198579416617',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6993',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0x63482dF9E3b186654750bEb2448AFA184d0DEa80',
            fee: '3000',
            tickLower: '-7980',
            tickUpper: '-6000',
            liquidity: '0',
            feeGrowthInside0LastX128: '7512715815340026441368415851599687',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6994',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0x63482dF9E3b186654750bEb2448AFA184d0DEa80',
            fee: '3000',
            tickLower: '-7980',
            tickUpper: '-6000',
            liquidity: '74755791901770639054',
            feeGrowthInside0LastX128: '9719992855296399043828953824262520',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '11124829706720716258444733717740620',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6996',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0x63482dF9E3b186654750bEb2448AFA184d0DEa80',
            fee: '3000',
            tickLower: '-8100',
            tickUpper: '-6060',
            liquidity: '151009138685422220477',
            feeGrowthInside0LastX128: '0',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6997',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0x63482dF9E3b186654750bEb2448AFA184d0DEa80',
            fee: '3000',
            tickLower: '-8100',
            tickUpper: '-6060',
            liquidity: '0',
            feeGrowthInside0LastX128: '0',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
        ])
      })

      it('should return all Positions from address filtered by pool', async () => {
        const positions = await sdk.uniswap.getPositions({
          protocol,
          ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af',
          poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
        })

        expect(positions).to.eql([
          {
            tokenId: '6780',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
            fee: '500',
            tickLower: '-7990',
            tickUpper: '-5110',
            liquidity: '0',
            feeGrowthInside0LastX128: '0',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '0',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
          {
            tokenId: '6781',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
            fee: '500',
            tickLower: '-7990',
            tickUpper: '-5110',
            liquidity: '0',
            feeGrowthInside0LastX128: '8519556846084454442949710601260011',
            feeGrowthInside1LastX128: '0',
            tokensOwed0: '16398984956330600875554198579416617',
            tokensOwed1: '0',
            operator: '0x0000000000000000000000000000000000000000',
          },
        ])
      })

      it('should fail (wallet address dont have any positions on the pool filtered)', async () => {
        await expect(
          sdk.uniswap.getPositions({
            protocol,
            ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af', // wallet address without any positions
            poolAddress: '0x212d2706586595788F78e4cF8e2f5eA7CF4D5aEB',
          })
        ).to.be.rejectedWith('No Pool Positions from owner address found for the address informed:')
      })

      it('should fail (pool informed doesnt exist)', async () => {
        await expect(
          sdk.uniswap.getPositions({
            protocol,
            ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af', // wallet address without any positions
            poolAddress: '0x48c5C0471CaC32557CC9f6d34D5040238feDA0b8',
          })
        ).to.be.rejectedWith('No Pool Positions from owner address found for the address informed:')
      })
    })

    describe('observePool', () => {
      it('should return observed prices', async () => {
        const observedPrices = await sdk.uniswap.observePool({
          protocol,
          pool: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
          secondsAgoToCheck: [3600000, 0],
        })
        expect(observedPrices).to.eql({ observedPrices: [3.4022276455660783e38, null] })
      })

      it('should fail (invalid pool address provided)', async () => {
        await expect(
          sdk.uniswap.observePool({
            protocol,
            pool: '0x48c5C0471CaC32557CC9f6d34D5040238feDA0b8', //invalid pool address
            secondsAgoToCheck: [3600000, 0],
          })
        ).to.be.rejectedWith('Execution reverted! Please double check parameters: pool, secondsAgoToCheck')
      })

      it('should fail (invalid secondsAgoToCheck provided)', async () => {
        await expect(
          sdk.uniswap.observePool({
            protocol,
            pool: '0x48c5C0471CaC32557CC9f6d34D5040238feDA0b8', //invalid pool address
            secondsAgoToCheck: [3600000, 0],
          })
        ).to.be.rejectedWith('Execution reverted! Please double check parameters: pool, secondsAgoToCheck')
      })
    })
  })

  describe('Quotation Functions', () => {
    let wallet
    before(async () => {
      wallet = await sdk.wallet.generateWalletFromPrivateKey({
        privateKey: process.env.PRIVATE_KEY_DEV02,
        protocol: 'POLYGON',
      })
    })

    describe('getSwapQuotation', () => {
      it('should fail - pool insufficient liquidity', async () => {
        await expect(
          sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: AtokenAddress,
            tokenOut: 'matic',
            amountOut: '1000',
          })
        ).to.be.rejectedWith('no sufficient liquidity')
      })

      describe('amounts & native currency tests', () => {
        it('should return quotation - Input: AmountIn (ERC20 => ERC20)', async () => {
          const swapQuot = await sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: AtokenAddress,
            tokenOut: BtokenAddress,
            amountIn: '0.1',
          })

          expect(swapQuot.swapQuotation.tokenIn).to.eql('0.1')
          expect(+swapQuot.swapQuotation.tokenOut).to.be.a('number')
          expect(swapQuot.swapTransaction.calldata).to.include('0x')
          expect(swapQuot.swapTransaction.value).to.eql('0x00')
          expect(swapQuot.swapTransaction.protocol).to.eql(protocol)
          expect(swapQuot.swapTransaction.tokenIn).to.eql(AtokenAddress)
          expect(swapQuot.swapTransaction.tokenOut).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: AmountIn (NATIVECURRENCY => ERC20)', async () => {
          const swapQuot = await sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: 'eth',
            tokenOut: BtokenAddress,
            amountIn: '0.1',
          })

          expect(swapQuot.swapQuotation.tokenIn).to.eql('0.1')
          expect(+swapQuot.swapQuotation.tokenOut).to.be.a('number')
          expect(swapQuot.swapTransaction.calldata).to.include('0x')
          expect(swapQuot.swapTransaction.value).to.not.eql('0x00')
          expect(swapQuot.swapTransaction.protocol).to.eql(protocol)
          expect(swapQuot.swapTransaction.tokenIn).to.eql('eth')
          expect(swapQuot.swapTransaction.tokenOut).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: AmountOut (ERC20 => ERC20)', async () => {
          const swapQuot = await sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: AtokenAddress,
            tokenOut: BtokenAddress,
            amountOut: '0.1',
          })

          expect(+swapQuot.swapQuotation.tokenIn).to.be.a('number')
          expect(swapQuot.swapQuotation.tokenOut).to.eql('0.1')
          expect(swapQuot.swapTransaction.calldata).to.include('0x')
          expect(swapQuot.swapTransaction.value).to.eql('0x00')
          expect(swapQuot.swapTransaction.protocol).to.eql(protocol)
          expect(swapQuot.swapTransaction.tokenIn).to.eql(AtokenAddress)
          expect(swapQuot.swapTransaction.tokenOut).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: AmountOut (NATIVECURRENCY => ERC20)', async () => {
          const swapQuot = await sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: 'eth',
            tokenOut: BtokenAddress,
            amountIn: '0.1',
          })
          expect(swapQuot.swapQuotation.tokenIn).to.eql('0.1')
          expect(+swapQuot.swapQuotation.tokenOut).to.be.a('number')
          expect(swapQuot.swapTransaction.calldata).to.include('0x')
          expect(swapQuot.swapTransaction.value).to.not.eql('0x00')
          expect(swapQuot.swapTransaction.protocol).to.eql(protocol)
          expect(swapQuot.swapTransaction.tokenIn).to.eql('eth')
          expect(swapQuot.swapTransaction.tokenOut).to.eql(BtokenAddress)
        })
      })

      describe('addresses', () => {
        it('should fail - invalid tokenIn address', async () => {
          await expect(
            sdk.uniswap.getSwapQuotation({
              wallet,
              protocol,
              tokenIn: '0x9C3c9283d3e21854697Cd22D3FAA240CfB032889',
              tokenOut: BtokenAddress,
              amountOut: '0.01',
            })
          ).to.be.rejectedWith("Returned values aren't valid")
        })
        it('should fail - invalid tokenOut address', async () => {
          await expect(
            sdk.uniswap.getSwapQuotation({
              wallet,
              protocol,
              tokenIn: AtokenAddress,
              tokenOut: '0x9C3c9283d3e21854697Cd22D3FAA240CfB032889',
              amountOut: '0.01',
            })
          ).to.be.rejectedWith("Returned values aren't valid")
        })
      })
    })

    describe('getMintPositionQuotation', () => {
      describe('amounts & native currency tests', () => {
        it('should return quotation - Input: amountTokenA (ERC20 => ERC20)', async () => {
          const mintQuot = await sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x63482dF9E3b186654750bEb2448AFA184d0DEa80', // t1-t2
            amountTokenA: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
          })

          expect(mintQuot.mintPositionQuotation.amountA).to.eql('0.1')
          expect(+mintQuot.mintPositionQuotation.amountB).to.be.a('number')
          expect(mintQuot.mintPositionTransaction.calldata).to.include('0x')
          expect(mintQuot.mintPositionTransaction.value).to.eql('0x00')
          expect(mintQuot.mintPositionTransaction.protocol).to.eql(protocol)
          expect(mintQuot.mintPositionTransaction.tokenA).to.eql(AtokenAddress)
          expect(mintQuot.mintPositionTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenA (NATIVECURRENCY => ERC20)', async () => {
          const mintQuot = await sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x60B01823b126CA3aaf2361607300e32C0634f25D', //matic-t2
            amountTokenA: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
          })

          expect(mintQuot.mintPositionQuotation.amountA).to.eql('0.1')
          expect(+mintQuot.mintPositionQuotation.amountB).to.be.a('number')
          expect(mintQuot.mintPositionTransaction.calldata).to.include('0x')
          expect(mintQuot.mintPositionTransaction.value).to.not.eql('0x00')
          expect(mintQuot.mintPositionTransaction.protocol).to.eql(protocol)
          expect(mintQuot.mintPositionTransaction.tokenA).to.eql(WMATICAddress)
          expect(mintQuot.mintPositionTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenB (ERC20 => ERC20)', async () => {
          const mintQuot = await sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x63482dF9E3b186654750bEb2448AFA184d0DEa80', // t1-t2
            amountTokenB: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
          })

          expect(+mintQuot.mintPositionQuotation.amountA).to.be.a('number')
          expect(mintQuot.mintPositionQuotation.amountB).to.eql('0.1')
          expect(mintQuot.mintPositionTransaction.calldata).to.include('0x')
          expect(mintQuot.mintPositionTransaction.value).to.eql('0x00')
          expect(mintQuot.mintPositionTransaction.protocol).to.eql(protocol)
          expect(mintQuot.mintPositionTransaction.tokenA).to.eql(AtokenAddress)
          expect(mintQuot.mintPositionTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenB (NATIVECURRENCY => ERC20)', async () => {
          const mintQuot = await sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x60B01823b126CA3aaf2361607300e32C0634f25D', //matic-t2
            amountTokenB: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
          })

          expect(+mintQuot.mintPositionQuotation.amountA).to.be.a('number')
          expect(mintQuot.mintPositionQuotation.amountB).to.eql('0.1')
          expect(mintQuot.mintPositionTransaction.calldata).to.include('0x')
          expect(mintQuot.mintPositionTransaction.value).to.not.eql('0x00')
          expect(mintQuot.mintPositionTransaction.protocol).to.eql(protocol)
          expect(mintQuot.mintPositionTransaction.tokenA).to.eql(WMATICAddress)
          expect(mintQuot.mintPositionTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenA (WRAPPED TOKEN => ERC20)', async () => {
          const mintQuot = await sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x60B01823b126CA3aaf2361607300e32C0634f25D', //matic-t2
            amountTokenA: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
            wrapped: true,
          })

          expect(mintQuot.mintPositionQuotation.amountA).to.eql('0.1')
          expect(+mintQuot.mintPositionQuotation.amountB).to.be.a('number')
          expect(mintQuot.mintPositionTransaction.calldata).to.include('0x')
          expect(mintQuot.mintPositionTransaction.value).to.eql('0x00')
          expect(mintQuot.mintPositionTransaction.protocol).to.eql(protocol)
          expect(mintQuot.mintPositionTransaction.tokenA).to.eql(WMATICAddress)
          expect(mintQuot.mintPositionTransaction.tokenB).to.eql(BtokenAddress)
        })
      })

      describe('addresses', () => {
        it('should fail - invalid pool address', async () => {
          await expect(
            sdk.uniswap.getMintPositionQuotation({
              wallet,
              protocol,
              pool: '0xc0d63761276a7fe60aef63663ff19cbb91f3623e', // t1-t2
              amountTokenA: '0.1',
              minPriceDelta: '10',
              maxPriceDelta: '10',
            })
          ).to.be.rejectedWith("Returned values aren't valid")
        })
      })

      describe('deltas', () => {
        it('should fail - invalid minDelta (greater than 100%)', async () => {
          await expect(
            sdk.uniswap.getMintPositionQuotation({
              wallet,
              protocol,
              pool: '0xc0d63761276a7fe60aef63663ff19cbb91f3623e', // t1-t2
              amountTokenA: '0.1',
              minPriceDelta: '101',
              maxPriceDelta: '10',
            })
          ).to.be.rejectedWith('minPriceDelta must be a value between 0 and 100%')
        })
        it('should fail - invalid minDelta (negative value)', async () => {
          await expect(
            sdk.uniswap.getMintPositionQuotation({
              wallet,
              protocol,
              pool: '0xc0d63761276a7fe60aef63663ff19cbb91f3623e', // t1-t2
              amountTokenA: '0.1',
              minPriceDelta: '-1',
              maxPriceDelta: '10',
            })
          ).to.be.rejectedWith('minPriceDelta must be a value between 0 and 100%')
        })
        it('should fail - invalid maxDelta (greater than 170%)', async () => {
          await expect(
            sdk.uniswap.getMintPositionQuotation({
              wallet,
              protocol,
              pool: '0xc0d63761276a7fe60aef63663ff19cbb91f3623e', // t1-t2
              amountTokenA: '0.1',
              minPriceDelta: '1',
              maxPriceDelta: '171',
            })
          ).to.be.rejectedWith('minPriceDelta must be a value between 0 and 170%')
        })
        it('should fail - invalid maxDelta (negative value)', async () => {
          await expect(
            sdk.uniswap.getMintPositionQuotation({
              wallet,
              protocol,
              pool: '0xc0d63761276a7fe60aef63663ff19cbb91f3623e', // t1-t2
              amountTokenA: '0.1',
              minPriceDelta: '1',
              maxPriceDelta: '-1',
            })
          ).to.be.rejectedWith('minPriceDelta must be a value between 0 and 170%')
        })
      })
    })

    describe('getIncreaseLiquidityQuotation', () => {
      describe('amounts & native currency tests', () => {
        it('should return quotation - Input: amountTokenA (ERC20 => ERC20)', async () => {
          const increaseQuot = await sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '7053', // t1 - t2
            amountTokenA: '0.1',
          })

          expect(increaseQuot.increaseLiquidityQuotation.amountA).to.eql('0.1')
          expect(+increaseQuot.increaseLiquidityQuotation.amountB).to.be.a('number')
          expect(increaseQuot.increaseLiquidityTransaction.calldata).to.include('0x')
          expect(increaseQuot.increaseLiquidityTransaction.value).to.eql('0x00')
          expect(increaseQuot.increaseLiquidityTransaction.protocol).to.eql(protocol)
          expect(increaseQuot.increaseLiquidityTransaction.tokenA).to.eql(AtokenAddress)
          expect(increaseQuot.increaseLiquidityTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenA (NATIVECURRENCY => ERC20)', async () => {
          const increaseQuot = await sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '7244', // wmatic - t2
            amountTokenA: '0.1',
          })

          expect(increaseQuot.increaseLiquidityQuotation.amountA).to.eql('0.1')
          expect(+increaseQuot.increaseLiquidityQuotation.amountB).to.be.a('number')
          expect(increaseQuot.increaseLiquidityTransaction.calldata).to.include('0x')
          expect(increaseQuot.increaseLiquidityTransaction.value).to.not.eql('0x00')
          expect(increaseQuot.increaseLiquidityTransaction.protocol).to.eql(protocol)
          expect(increaseQuot.increaseLiquidityTransaction.tokenA).to.eql(WMATICAddress)
          expect(increaseQuot.increaseLiquidityTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenB (ERC20 => ERC20)', async () => {
          const increaseQuot = await sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '7053', // t1 - t2
            amountTokenB: '0.1',
          })

          expect(+increaseQuot.increaseLiquidityQuotation.amountA).to.be.a('number')
          expect(increaseQuot.increaseLiquidityQuotation.amountB).to.eql('0.1')
          expect(increaseQuot.increaseLiquidityTransaction.calldata).to.include('0x')
          expect(increaseQuot.increaseLiquidityTransaction.value).to.eql('0x00')
          expect(increaseQuot.increaseLiquidityTransaction.protocol).to.eql(protocol)
          expect(increaseQuot.increaseLiquidityTransaction.tokenA).to.eql(AtokenAddress)
          expect(increaseQuot.increaseLiquidityTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenB (NATIVECURRENCY => ERC20)', async () => {
          const increaseQuot = await sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '7244', // t1 - t2
            amountTokenB: '0.1',
          })

          expect(+increaseQuot.increaseLiquidityQuotation.amountA).to.be.a('number')
          expect(increaseQuot.increaseLiquidityQuotation.amountB).to.eql('0.1')
          expect(increaseQuot.increaseLiquidityTransaction.calldata).to.include('0x')
          expect(increaseQuot.increaseLiquidityTransaction.value).to.not.eql('0x00')
          expect(increaseQuot.increaseLiquidityTransaction.protocol).to.eql(protocol)
          expect(increaseQuot.increaseLiquidityTransaction.tokenA).to.eql(WMATICAddress)
          expect(increaseQuot.increaseLiquidityTransaction.tokenB).to.eql(BtokenAddress)
        })

        it('should return quotation - Input: amountTokenA (WRAPPED TOKEN => ERC20)', async () => {
          const increaseQuot = await sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '7244', // wmatic - t2
            amountTokenA: '0.1',
            wrapped: true,
          })

          expect(increaseQuot.increaseLiquidityQuotation.amountA).to.eql('0.1')
          expect(+increaseQuot.increaseLiquidityQuotation.amountB).to.be.a('number')
          expect(increaseQuot.increaseLiquidityTransaction.calldata).to.include('0x')
          expect(increaseQuot.increaseLiquidityTransaction.value).to.eql('0x00')
          expect(increaseQuot.increaseLiquidityTransaction.protocol).to.eql(protocol)
          expect(increaseQuot.increaseLiquidityTransaction.tokenA).to.eql(WMATICAddress)
          expect(increaseQuot.increaseLiquidityTransaction.tokenB).to.eql(BtokenAddress)
        })
      })

      describe('addresses', () => {
        it('should fail - invalid pool tokenId', async () => {
          await expect(
            sdk.uniswap.getIncreaseLiquidityQuotation({
              protocol,
              wallet,
              tokenId: '99999',
              amountTokenA: '0.1',
            })
          ).to.be.rejectedWith('Invalid token ID')
        })
      })
    })
  })

  describe('WRITE Functions', () => {
    let wallet
    before(async () => {
      wallet = await sdk.wallet.generateWalletFromPrivateKey({
        privateKey: process.env.PRIVATE_KEY_DEV02,
        protocol: 'POLYGON',
      })
    })

    describe('createPool', () => {
      it('should create Pool', async () => {
        const createPool = await sdk.uniswap.createPool({
          wallet,
          protocol,
          fee: 3000, // 100x , 500x , 3000 , 10000
          tokenA: AtokenAddress,
          tokenB: DtokenAddress,
          price: '2',
        })
        expect(createPool.pool).to.have.length(42)
        expect(createPool.transaction.hash).to.have.length(66)
      })

      it('should return Pool address if pool already exists', async () => {
        const createPool = await sdk.uniswap.createPool({
          wallet,
          protocol,
          fee: 10000,
          tokenA: CtokenAddress,
          tokenB: DtokenAddress,
          price: '2',
        })

        expect(createPool).to.have.property('pool', '0xe238dcFa13E14a7108e821F07321597D5bdD6A96')
        expect(createPool).to.have.property('transaction', null)
      })
    })

    describe('increaseCardinality', () => {
      it('should increase cardinality', async () => {
        const increaseCardinality = await sdk.uniswap.increaseCardinality({
          protocol,
          pool: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
          wallet,
          cardinality: 4,
        })
        expect(increaseCardinality.hash).to.have.length(66)
      })
    })

    describe('decreaseLiqudity', () => {
      it('should decrease Liquidity', async () => {
        const decreaseLiquidity = await sdk.uniswap.decreaseLiquidity({
          protocol,
          wallet,
          tokenId: '7053',
          percentageToDecrease: '10',
          slippage: '5',
        })

        expect(decreaseLiquidity.hash).to.have.length(66)
      })

      it('should fail (invalid percentage to decrease)', async () => {
        await expect(
          sdk.uniswap.decreaseLiquidity({
            protocol,
            wallet,
            tokenId: '7053',
            percentageToDecrease: '101',
            slippage: '5',
          })
        ).to.be.rejectedWith('percentageToDecrease must be between 0% and 100%')
      })
    })

    describe('collectFees', () => {
      it('should collect Pool fees', async () => {
        const collectFees = await sdk.uniswap.collectFees({
          protocol,
          wallet,
          tokenId: '7244', //t2-matic 1%
        })

        expect(collectFees.hash).to.have.length(66)
      })

      it('should fail (pool position dont have fee amounts to be collected)', async () => {
        await expect(
          sdk.uniswap.collectFees({
            protocol,
            wallet,
            tokenId: '7051',
          })
        ).to.be.rejectedWith('The position does not have fees to be collected')
      })
    })

    describe('swap', () => {
      it('should execute a swap transaction', async () => {
        const swapQuotation = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn: AtokenAddress,
          tokenOut: BtokenAddress,
          amountIn: '0.01',
        })

        const swap = await sdk.uniswap.swap({
          wallet,
          transaction: swapQuotation,
        })

        expect(swap.hash).to.have.length(66)
      })
    })

    describe('mintPosition', () => {
      it('should execute a mintPosition transaction', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
          amountTokenA: '0.1',
          minPriceDelta: '10',
          maxPriceDelta: '10',
        })

        const mintPositionTransaction = await sdk.uniswap.mintPosition({
          wallet,
          transaction: mintPositionQuotation,
        })

        expect(mintPositionTransaction.hash).to.have.length(66)
      })
    })

    describe('increaseLiquidity', () => {
      it('should execute a increaseLiquidity transaction', async () => {
        const increaseLiquidityQuotation = await sdk.uniswap.getIncreaseLiquidityQuotation({
          protocol,
          wallet,
          tokenId: '7244',
          amountTokenA: '0.01',
        })

        const increaseLiquidityTransaction = await sdk.uniswap.increaseLiquidity({
          wallet,
          transaction: increaseLiquidityQuotation,
        })

        expect(increaseLiquidityTransaction.hash).to.have.length(66)
      })
    })
  })

  describe('Common Tests', () => {
    let wallet

    describe('Invalid Slippages', () => {
      before(async () => {
        wallet = await sdk.wallet.generateWalletFromPrivateKey({
          privateKey: process.env.PRIVATE_KEY_DEV02,
          protocol: 'POLYGON',
        })
      })

      it('getSwapQuotation - should fail (invalid slippage provided >50%)', async () => {
        await expect(
          sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: AtokenAddress,
            tokenOut: BtokenAddress,
            amountIn: '0.1',
            slippage: '50.1',
          })
        ).to.be.rejectedWith('Slippage percentage must be lesser than 50 (50%)')
      })

      it('getSwapQuotation - should fail (negative slippage provided)', async () => {
        await expect(
          sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: AtokenAddress,
            tokenOut: BtokenAddress,
            amountIn: '0.1',
            slippage: '-1',
          })
        ).to.be.rejectedWith('Slippage percentage must be a positive amount')
      })

      it('getMintPositionQuotation - should fail (invalid slippage provided >50%)', async () => {
        await expect(
          sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
            amountTokenB: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
            slippage: '50.1',
            // wrapped: true
          })
        ).to.be.rejectedWith('Slippage percentage must be lesser than 50 (50%)')
      })

      it('getMintPositionQuotation - should fail (negative slippage provided)', async () => {
        await expect(
          sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
            amountTokenB: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
            slippage: '-1',
          })
        ).to.be.rejectedWith('Slippage percentage must be a positive amount')
      })

      it('increaseLiquidity - should fail (invalid slippage provided >50%)', async () => {
        await expect(
          sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '1234',
            amountTokenA: '0.1',
            slippage: '50.1',
          })
        ).to.be.rejectedWith('Slippage percentage must be lesser than 50 (50%)')
      })

      it('increaseLiquidity - should fail (negative slippage provided)', async () => {
        await expect(
          sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '1234',
            amountTokenA: '0.1',
            slippage: '-1',
          })
        ).to.be.rejectedWith('Slippage percentage must be a positive amount')
      })

      it('decreaseLiquidity - should fail (invalid slippage provided >50%)', async () => {
        await expect(
          sdk.uniswap.decreaseLiquidity({
            protocol,
            wallet,
            tokenId: '7053',
            percentageToDecrease: '1000',
            slippage: '51',
          })
        ).to.be.rejectedWith('percentageToDecrease must be between 0% and 100%')
      })

      it('decreaseLiquidity - should fail (negative slippage provided)', async () => {
        await expect(
          sdk.uniswap.decreaseLiquidity({
            protocol,
            wallet,
            tokenId: '7053',
            percentageToDecrease: '1000',
            slippage: '-1',
          })
        ).to.be.rejectedWith('percentageToDecrease must be between 0% and 100%')
      })
    })

    describe('Invalid Deadlines', () => {
      before(async () => {
        wallet = await sdk.wallet.generateWalletFromPrivateKey({
          privateKey: process.env.PRIVATE_KEY_DEV02,
          protocol: 'POLYGON',
        })
      })

      it('getSwapQuotation - should fail (invalid Deadlines provided >4320 minutes)', async () => {
        await expect(
          sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: AtokenAddress,
            tokenOut: BtokenAddress,
            amountIn: '0.1',
            deadline: '4321',
          })
        ).to.be.rejectedWith('Deadline minutes must be lesser than 4320 (72hours)')
      })

      it('getSwapQuotation - should fail (negative deadline provided)', async () => {
        await expect(
          sdk.uniswap.getSwapQuotation({
            wallet,
            protocol,
            tokenIn: AtokenAddress,
            tokenOut: BtokenAddress,
            amountIn: '0.1',
            deadline: '-1',
          })
        ).to.be.rejectedWith('Deadline minutes must be a positive amount')
      })

      it('getMintPositionQuotation - should fail (invalid deadline provided >4320 minutes)', async () => {
        await expect(
          sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
            amountTokenB: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
            deadline: '4321',
          })
        ).to.be.rejectedWith('Deadline minutes must be lesser than 4320 (72hours)')
      })

      it('getMintPositionQuotation - should fail (negative deadline provided)', async () => {
        await expect(
          sdk.uniswap.getMintPositionQuotation({
            wallet,
            protocol,
            pool: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
            amountTokenB: '0.1',
            minPriceDelta: '10',
            maxPriceDelta: '10',
            deadline: '-1',
          })
        ).to.be.rejectedWith('Deadline minutes must be a positive amount')
      })

      it('increaseLiquidity - should fail (invalid deadline provided >4320 minutes)', async () => {
        await expect(
          sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '7053',
            amountTokenA: '0.1',
            deadline: '4321',
          })
        ).to.be.rejectedWith('Deadline minutes must be lesser than 4320 (72hours)')
      })

      it('increaseLiquidity - should fail (negative deadline provided)', async () => {
        await expect(
          sdk.uniswap.getIncreaseLiquidityQuotation({
            protocol,
            wallet,
            tokenId: '7053',
            amountTokenA: '0.1',
            deadline: '-1',
          })
        ).to.be.rejectedWith('Deadline minutes must be a positive amount')
      })

      it('decreaseLiquidity - should fail (invalid deadline provided >4320 minutes)', async () => {
        await expect(
          sdk.uniswap.decreaseLiquidity({
            protocol,
            wallet,
            tokenId: '7053',
            percentageToDecrease: '10',
            deadline: '4321',
          })
        ).to.be.rejectedWith('Deadline minutes must be lesser than 4320 (72hours)')
      })

      it('decreaseLiquidity - should fail (negative deadline provided)', async () => {
        await expect(
          sdk.uniswap.decreaseLiquidity({
            protocol,
            wallet,
            tokenId: '7053',
            percentageToDecrease: '10',
            deadline: '-1',
          })
        ).to.be.rejectedWith('Deadline minutes must be a positive amount')
      })
    })

    describe('Insufficient funds', () => {
      before(async () => {
        wallet = await sdk.wallet.generateWalletFromPrivateKey({
          privateKey: process.env.PRIVATE_KEY_DEV02,
          protocol: 'POLYGON',
        })
      })

      it('swap - should fail (insufficient tokens)', async () => {
        const swapQuote = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn: AtokenAddress,
          tokenOut: BtokenAddress,
          amountIn: '100',
        })

        await expect(
          sdk.uniswap.swap({
            wallet,
            transaction: swapQuote,
          })
        ).to.be.rejectedWith('insufficient funds')
      })

      it('swap - should fail (insufficient native funds)', async () => {
        const swapQuote = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn: 'matic',
          tokenOut: BtokenAddress,
          amountIn: '100',
        })

        await expect(
          sdk.uniswap.swap({
            wallet,
            transaction: swapQuote,
          })
        ).to.be.rejectedWith('insufficient funds')
      })

      it('mintPosition - should fail (insufficient tokens)', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: '0x500e45883F2D25e62af5cb20c45187d5D06472df', // token-token
          amountTokenA: '10000000',
          minPriceDelta: '10',
          maxPriceDelta: '10',
        })

        await expect(
          sdk.uniswap.mintPosition({
            wallet,
            transaction: mintPositionQuotation,
          })
        ).to.be.rejectedWith('insufficient funds')
      })

      it('mintPosition - should fail (insufficient native funds)', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: '0x60B01823b126CA3aaf2361607300e32C0634f25D', // matic- token
          amountTokenA: '10',
          minPriceDelta: '10',
          maxPriceDelta: '10',
        })

        await expect(
          sdk.uniswap.mintPosition({
            wallet,
            transaction: mintPositionQuotation,
          })
        ).to.be.rejectedWith('insufficient funds')
      })

      it('increaseLiquidity - should fail (insufficient tokens)', async () => {
        const increaseLiquidityQuotation = await sdk.uniswap.getIncreaseLiquidityQuotation({
          protocol,
          wallet,
          tokenId: '7053', // token-token
          amountTokenA: '30',
        })

        await expect(
          sdk.uniswap.increaseLiquidity({
            wallet,
            transaction: increaseLiquidityQuotation,
          })
        ).to.be.rejectedWith('insufficient funds')
      })

      it('increaseLiquidity - should fail (insufficient native funds)', async () => {
        const increaseLiquidityQuotation = await sdk.uniswap.getIncreaseLiquidityQuotation({
          protocol,
          wallet,
          tokenId: '7244', // matic - token
          amountTokenA: '7',
          wrapped: false,
        })

        await expect(
          sdk.uniswap.increaseLiquidity({
            wallet,
            transaction: increaseLiquidityQuotation,
          })
        ).to.be.rejectedWith('insufficient funds')
      })
    })

    describe('No Token Approval', () => {
      before(async () => {
        wallet = await sdk.wallet.generateWalletFromPrivateKey({
          privateKey: process.env.PRIVATE_KEY_DEV02,
          protocol: 'POLYGON',
        })
      })

      it('mintPosition - should fail (no token approval)', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: '0xe238dcFa13E14a7108e821F07321597D5bdD6A96',
          amountTokenA: '10000000',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          // wrapped: true
        })
        await expect(
          sdk.uniswap.mintPosition({
            wallet,
            transaction: mintPositionQuotation,
          })
        ).to.be.rejectedWith('First Approve')
      })

      it('swap - should fail (no token approval)', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: '0xe238dcFa13E14a7108e821F07321597D5bdD6A96',
          amountTokenA: '10000000',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          // wrapped: true
        })
        await expect(
          sdk.uniswap.mintPosition({
            wallet,
            transaction: mintPositionQuotation,
          })
        ).to.be.rejectedWith('First Approve')
      })

      it('increase liquidity - should fail (no token approval)', async () => {
        const increaseLiquidityQuotation = await sdk.uniswap.getIncreaseLiquidityQuotation({
          protocol,
          wallet,
          tokenId: '7917',
          amountTokenA: '0.1',
          wrapped: true,
        })

        await expect(
          sdk.uniswap.increaseLiquidity({
            wallet,
            transaction: increaseLiquidityQuotation,
          })
        ).to.be.rejectedWith('First Approve')
      })
    })
  })
})
