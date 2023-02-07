const CryptumSdk = require("c:/Users/Victor Collasanta/Desktop/Blockchain Local/Blockforce-Cryptum/Cryptum/uniswap-sdk/cryptum-sdk/index")
const { expect } = require('chai')
const nock = require('nock');
require('dotenv').config();

const apikey = process.env.CRYPTUM_API_KEY
const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: apikey,
})

  // function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }


describe('Uniswap Controller Test', () => {
  const protocol = 'POLYGON'
  const AtokenAddress = "0xE3031a696aDE55789371CEA339d5fbCF2B6339f9" //t1
  const BtokenAddress = "0xFf432f16F3d84eD1985EdFed30203F99d57Fe979" //t2
  const CtokenAddress = "0x536feD66120b2d346589c6618219B026D7dF1Bcc" //t3
  const DtokenAddress = "0x17C41Bc1962e987504a77033238fFc7C6C26895F" //t4

  describe('READ Functions', () => {
    describe('getPools', () => {

      it('should return pool fees', async () => {
        const pools = await sdk.uniswap.getPools({
          protocol,
          tokenA: AtokenAddress,
          tokenB: BtokenAddress,
        })
        // console.log({pools})
        expect(pools).to.eql([{
          poolAddress: "0x500e45883F2D25e62af5cb20c45187d5D06472df",
          poolFee: 100
        },
        {
          poolAddress: "0xC9d335CB5D4859090f1F8f67643441B6d330de0C",
          poolFee: 500
        },
        {
          poolAddress: "0x63482dF9E3b186654750bEb2448AFA184d0DEa80",
          poolFee: 3000
        },
        {
          poolAddress: null,
          poolFee: 10000
        }]);
      })

      it('should return null pool fees (inexistent pools)', async () => {
        const pools = await sdk.uniswap.getPools({
          protocol,
          tokenA: AtokenAddress,
          tokenB: "0xd6666D2C4e00e5C0f96BC5956Fe514f0f1A4f0AB",
        })
        // console.log({pools})
        expect(pools).to.eql([{
          poolAddress: null,
          poolFee: 100
        },
        {
          poolAddress: null,
          poolFee: 500
        },
        {
          poolAddress: null,
          poolFee: 3000
        },
        {
          poolAddress: null,
          poolFee: 10000
        }]);
      })

    })

    describe('getPoolData', () => {

      it('should return pool data', async () => {
        const poolData = await sdk.uniswap.getPoolData({
          protocol,
          poolAddress: "0x500e45883F2D25e62af5cb20c45187d5D06472df"
        })
        // console.log({poolData})
        expect(poolData).to.eql({
            poolAddress: '0x500e45883F2D25e62af5cb20c45187d5D06472df',
            fee: '100',
            token0: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            token1: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            liquidity: '2755008081329571604',
            tickSpacing: '1',
            slot0: {
              sqrtPriceX96: '56022262241300288188759753413',
              tick: '-6932',
              observationIndex: '0',
              observationCardinality: '1',
              observationCardinalityNext: '1',
              feeProtocol: '0',
              unlocked: true
            }
          });
      })

      it('should fail (wrong pool address provided)', async () => {
        await expect(
          sdk.uniswap.getPoolData({
            protocol,
            poolAddress: "0x5268e5c5a755c2527f601bd58778319b4df12a4c" // wrong address
            // poolAddress: "0x500e45983F2D25e62af5cb20c45187d5D06472df"
          })
          ).to.be.rejectedWith("Pool not found! Please provide a valid Pool Address.")
      })

    })

    describe('getTokenIds', () => {

      it('should return tokenIds', async () => {
        const tokenIds = await sdk.uniswap.getTokenIds({
            protocol,
            ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af',
        })
        // console.log("getTokenIds", tokenIds)
        expect(tokenIds).to.eql([
          '6122', '6124',
          '6467', '6780',
          '6781', '6993',
          '6994', '6996',
          '6997'
        ]);
      })

      it('should fail (wallet address without any positions)', async () => {
        await expect( sdk.uniswap.getTokenIds({
          protocol,
          ownerAddress: "0x2268e5c5a755c2527f601bd58778319b4df12a4c" // wallet address without any positions
        })).to.be.rejectedWith("No Positions(Token IDs) found for this wallet address")
      })

    })

    describe('getPosition', () => {

      it('should return position info', async () => {
        const position = await sdk.uniswap.getPosition({
            protocol,
            tokenId: "7051"
        })
        // console.log("position", position)
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
          tokensOwed1: '0'
        });
      })

      it('should fail (tokenId prodoes not exists)', async () => {
        await expect( sdk.uniswap.getPosition({
          protocol,
          tokenId: "9999999"
        })).to.be.rejectedWith("Invalid token ID")
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
        // console.log("getPositions", positions)
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
          }
        ]);
      })

      it('should return all Positions from address filtered by pool', async () => {
        const positions = await sdk.uniswap.getPositions({
            protocol,
            ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af',
            poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C'
            // ownerAddress: '0x43a51e57cC67012688568Ae4E9df164B2d5b093d',
        })
        // console.log("getPositions", positions)
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
            operator: '0x0000000000000000000000000000000000000000'
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
            operator: '0x0000000000000000000000000000000000000000'
          }
        ]);
      })

      it('should fail (wallet address dont have any positions on the pool filtered)', async () => {
        await expect( sdk.uniswap.getPositions({
          protocol,
          ownerAddress: "0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af", // wallet address without any positions
          poolAddress: '0x212d2706586595788F78e4cF8e2f5eA7CF4D5aEB'
        })).to.be.rejectedWith("No Pool Positions from owner address found for the address informed:")
      })

      it('should fail (pool informed doesnt exist)', async () => {
        await expect( sdk.uniswap.getPositions({
          protocol,
          ownerAddress: "0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af", // wallet address without any positions
          poolAddress: '0x48c5C0471CaC32557CC9f6d34D5040238feDA0b8'
        })).to.be.rejectedWith("No Pool Positions from owner address found for the address informed:")
      })

    })

    describe('observePool', () => {

      it('should return observed prices', async () => {
        const observedPrices = await sdk.uniswap.observePool({
          protocol,
          pool: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
          secondsAgoToCheck: [3600000, 0]
        })
        expect(observedPrices).to.eql({ observedPrices: [ 3.4022276455660783e+38, null ] });
      })

      it('should fail (invalid pool address provided)', async () => {
        await expect( sdk.uniswap.observePool({
          protocol,
          pool: '0x48c5C0471CaC32557CC9f6d34D5040238feDA0b8', //invalid pool address
          secondsAgoToCheck: [3600000, 0]
        })).to.be.rejectedWith("Execution reverted! Please double check parameters: pool, secondsAgoToCheck")
        
      })

      it('should fail (invalid secondsAgoToCheck provided)', async () => {
        await expect( sdk.uniswap.observePool({
          protocol,
          pool: '0x48c5C0471CaC32557CC9f6d34D5040238feDA0b8', //invalid pool address
          secondsAgoToCheck: [3600000, 0]
        })).to.be.rejectedWith("Execution reverted! Please double check parameters: pool, secondsAgoToCheck")
        
      })

    })
  })

  describe('Quotation Functions', () => {

    describe('getSwapQuotation', () => {
      let wallet 

      before(async () => {
          wallet = await sdk.wallet.generateWalletFromPrivateKey({
          privateKey: process.env.PRIVATE_KEY_DEV02,
          protocol: 'POLYGON',
        })
      })

      it('should return quotation - ERC20 => ERC20', async () => {
        const swapQuot = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  AtokenAddress, 
          tokenOut: BtokenAddress, 
          amountIn: "0.1", 
        })

        delete swapQuot.swapTransaction.calldata

        expect(swapQuot).to.eql({
          swapQuotation: { tokenIn: '0.1', tokenOut: '0.0517651527' },
          swapTransaction: {
            // calldata: "0x5ae401dc0000000000000000000000000000000000000000000000000000000063dd321e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000e3031a696ade55789371cea33d5fbcf2b6339f9000000000000000000000000ff432f16f3d84ed1985edfed30203f99d57fe9790000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000002d09c7fd87b8ce1cfacca91094664c5d8a6c9839000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000b6fde714bf7906000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            value: '0x00',
            protocol: 'POLYGON',
            tokenIn: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            tokenOut: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979'
          }
        });
      })

      it('should return quotation - "NATIVECURRENCY" => ERC20', async () => {
        const swapQuot = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  'eth', 
          tokenOut: BtokenAddress, 
          amountIn: "0.1", 
        })

        delete swapQuot.swapTransaction.calldata

        expect(swapQuot).to.eql({
          swapQuotation: { tokenIn: '0.1', tokenOut: '0.1961550541' },
          swapTransaction: {
            // calldata: '0x5ae401dc0000000000000000000000000000000000000000000000000000000063dd388400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb032889000000000000000000000000ff432f16f3d84ed1985edfed30203f99d57fe97900000000000000000000000000000000000000000000000000000000000027100000000000000000000000002d09c7fd87b8ce1cfacca91094664c5d8a6c9839000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002b56a6913bfd65b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            value: '0x016345785d8a0000',
            protocol: 'POLYGON',
            tokenIn: 'eth',
            tokenOut: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979'
          }
        });
      })
      
      it('should return quotation - ERC20 => "NATIVECURRENCY"', async () => {
        const swapQuot = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  BtokenAddress, 
          tokenOut: 'eth', 
          amountIn: "0.1", 
        })

        delete swapQuot.swapTransaction.calldata

        expect(swapQuot).to.eql({
          swapQuotation: { tokenIn: '0.1', tokenOut: '0.0489144888' },
          swapTransaction: {
            // calldata: '0x5ae401dc0000000000000000000000000000000000000000000000000000000063dd390d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000ff432f16f3d84ed1985edfed30203f99d57fe9790000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb03288900000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000acea2344e0e6f7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000acea2344e0e6f70000000000000000000000002d09c7fd87b8ce1cfacca91094664c5d8a6c983900000000000000000000000000000000000000000000000000000000',
            value: '0x00',
            protocol: 'POLYGON',
            tokenIn: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
            tokenOut: 'eth'
          }
        });
      })

    })

    describe('getMintPositionQuotation', () => {
      let wallet 

      before(async () => {
          wallet = await sdk.wallet.generateWalletFromPrivateKey({
          privateKey: process.env.PRIVATE_KEY_DEV02,
          protocol: 'POLYGON',
        })
      })

      it('should return quotation - ERC20 => ERC20', async () => {
        const swapQuot = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  AtokenAddress, 
          tokenOut: BtokenAddress, 
          amountIn: "0.1", 
        })

        delete swapQuot.swapTransaction.calldata

        expect(swapQuot).to.eql({
          swapQuotation: { tokenIn: '0.1', tokenOut: '0.0517651527' },
          swapTransaction: {
            // calldata: "0x5ae401dc0000000000000000000000000000000000000000000000000000000063dd321e00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000e3031a696ade55789371cea33d5fbcf2b6339f9000000000000000000000000ff432f16f3d84ed1985edfed30203f99d57fe9790000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000002d09c7fd87b8ce1cfacca91094664c5d8a6c9839000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000b6fde714bf7906000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            value: '0x00',
            protocol: 'POLYGON',
            tokenIn: '0xE3031a696aDE55789371CEA339d5fbCF2B6339f9',
            tokenOut: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979'
          }
        });
      })

      // it('should return quotation - "NATIVECURRENCY" => ERC20', async () => {
      //   const swapQuot = await sdk.uniswap.getSwapQuotation({
      //     wallet,
      //     protocol,
      //     tokenIn:  'eth', 
      //     tokenOut: BtokenAddress, 
      //     amountIn: "0.1", 
      //   })

      //   delete swapQuot.swapTransaction.calldata

      //   expect(swapQuot).to.eql({
      //     swapQuotation: { tokenIn: '0.1', tokenOut: '0.1961550541' },
      //     swapTransaction: {
      //       // calldata: '0x5ae401dc0000000000000000000000000000000000000000000000000000000063dd388400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb032889000000000000000000000000ff432f16f3d84ed1985edfed30203f99d57fe97900000000000000000000000000000000000000000000000000000000000027100000000000000000000000002d09c7fd87b8ce1cfacca91094664c5d8a6c9839000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002b56a6913bfd65b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      //       value: '0x016345785d8a0000',
      //       protocol: 'POLYGON',
      //       tokenIn: 'eth',
      //       tokenOut: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979'
      //     }
      //   });
      // })
      
      // it('should return quotation - ERC20 => "NATIVECURRENCY"', async () => {
      //   const swapQuot = await sdk.uniswap.getSwapQuotation({
      //     wallet,
      //     protocol,
      //     tokenIn:  BtokenAddress, 
      //     tokenOut: 'eth', 
      //     amountIn: "0.1", 
      //   })

      //   delete swapQuot.swapTransaction.calldata

      //   expect(swapQuot).to.eql({
      //     swapQuotation: { tokenIn: '0.1', tokenOut: '0.0489144888' },
      //     swapTransaction: {
      //       // calldata: '0x5ae401dc0000000000000000000000000000000000000000000000000000000063dd390d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000ff432f16f3d84ed1985edfed30203f99d57fe9790000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb03288900000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000acea2344e0e6f7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000acea2344e0e6f70000000000000000000000002d09c7fd87b8ce1cfacca91094664c5d8a6c983900000000000000000000000000000000000000000000000000000000',
      //       value: '0x00',
      //       protocol: 'POLYGON',
      //       tokenIn: '0xFf432f16F3d84eD1985EdFed30203F99d57Fe979',
      //       tokenOut: 'eth'
      //     }
      //   });
      // })

    })
  })

  describe('WRITE Functions', () => { 
    describe('createPool', () => {
      let wallet 
      before(async () => {
          wallet = await sdk.wallet.generateWalletFromPrivateKey({
          privateKey: process.env.PRIVATE_KEY_DEV02,
          protocol: 'POLYGON',
        })
      })

      it('should create Pool', async () => {
        // const createPool = await sdk.uniswap.createPool({
        //   wallet,
        //   protocol,
        //   fee: 10000,
        //   tokenA: CtokenAddress,
        //   tokenB: DtokenAddress,
        //   price: '2',
        // })

        // expect(createPool).to.eql(
        //   {
        //     transaction: { hash: '0xa1319c3c08a9d61d2987d9106da3d4f289c72e92b5dc5d49a28a76c7f0e62a04' },
        //     pool: '0xe238dcFa13E14a7108e821F07321597D5bdD6A96'
        //   }
        // );
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
        await expect(sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  AtokenAddress, 
          tokenOut: BtokenAddress, 
          amountIn: "0.1", 
          slippage: "50.1",
        })).to.be.rejectedWith("Slippage percentage must be lesser than 50 (50%)")
      })

      it('getSwapQuotation - should fail (negative slippage provided)', async () => {
        await expect(sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  AtokenAddress, 
          tokenOut: BtokenAddress, 
          amountIn: "0.1", 
          slippage: "-1",
        })).to.be.rejectedWith('Slippage percentage must be a positive amount')
      })

      it('getMintPositionQuotation - should fail (invalid slippage provided >50%)', async () => {
        await expect(sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: "0x500e45883F2D25e62af5cb20c45187d5D06472df",
          amountTokenB: '0.1',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          slippage: '50.1',
          // wrapped: true
        })).to.be.rejectedWith("Slippage percentage must be lesser than 50 (50%)")
      })

      it('getMintPositionQuotation - should fail (negative slippage provided)', async () => {
        await expect(sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: "0x500e45883F2D25e62af5cb20c45187d5D06472df",
          amountTokenB: '0.1',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          slippage: '-1',
        })).to.be.rejectedWith('Slippage percentage must be a positive amount')
      })

      it('increaseLiquidity - should fail (invalid slippage provided >50%)', async () => {
        await expect(sdk.uniswap.increaseLiquidity({
          protocol,
          wallet,
          tokenId: "7113",
          token0amount: "0.1",
          token1amount: "0.1",
          slippage: '50.1',
        })).to.be.rejectedWith("Slippage percentage must be lesser than 50 (50%)")
      })

      it('increaseLiquidity - should fail (negative slippage provided)', async () => {
        await expect(sdk.uniswap.increaseLiquidity({
          protocol,
          wallet,
          tokenId: "7113",
          token0amount: "0.1",
          token1amount: "0.1",
          slippage: '-1',
        })).to.be.rejectedWith('Slippage percentage must be a positive amount')
      })

      it('decreaseLiquidity - should fail (invalid slippage provided >50%)', async () => {
        await expect(sdk.uniswap.decreaseLiquidity({
          protocol,
          wallet,
          tokenId: "7053",
          percentageToDecrease: "1000",
          slippage: '51',
        })).to.be.rejectedWith("Slippage percentage must be lesser than 50 (50%)")
      })

      it('decreaseLiquidity - should fail (negative slippage provided)', async () => {
        await expect(sdk.uniswap.decreaseLiquidity({
          protocol,
          wallet,
          tokenId: "7053",
          percentageToDecrease: "1000",
          slippage: '-1',
        })).to.be.rejectedWith('Slippage percentage must be a positive amount')
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
        await expect(sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  AtokenAddress, 
          tokenOut: BtokenAddress, 
          amountIn: "0.1", 
          deadline: "4321"
        })).to.be.rejectedWith("Deadline minutes must be lesser than 4320 (72hours)")
      })

      it('getSwapQuotation - should fail (negative deadline provided)', async () => {
        await expect(sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  AtokenAddress, 
          tokenOut: BtokenAddress, 
          amountIn: "0.1", 
          deadline: "-1"
        })).to.be.rejectedWith('Deadline minutes must be a positive amount')
      })

      it('getMintPositionQuotation - should fail (invalid deadline provided >4320 minutes)', async () => {
        await expect(sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: "0x500e45883F2D25e62af5cb20c45187d5D06472df",
          amountTokenB: '0.1',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          deadline: "4321"
        })).to.be.rejectedWith("Deadline minutes must be lesser than 4320 (72hours)")
      })

      it('getMintPositionQuotation - should fail (negative deadline provided)', async () => {
        await expect(sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: "0x500e45883F2D25e62af5cb20c45187d5D06472df",
          amountTokenB: '0.1',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          deadline: "-1",
        })).to.be.rejectedWith('Deadline minutes must be a positive amount')
      })

      it('increaseLiquidity - should fail (invalid deadline provided >4320 minutes)', async () => {
        await expect(sdk.uniswap.increaseLiquidity({
          protocol,
          wallet,
          tokenId: "7113",
          token0amount: "0.1",
          token1amount: "0.1",
          deadline: "4321"
        })).to.be.rejectedWith("Deadline minutes must be lesser than 4320 (72hours)")
      })

      it('increaseLiquidity - should fail (negative deadline provided)', async () => {
        await expect(sdk.uniswap.increaseLiquidity({
          protocol,
          wallet,
          tokenId: "7113",
          token0amount: "0.1",
          token1amount: "0.1",
          deadline: "-1"
        })).to.be.rejectedWith('Deadline minutes must be a positive amount')
      })

      it('decreaseLiquidity - should fail (invalid deadline provided >4320 minutes)', async () => {
        await expect(sdk.uniswap.decreaseLiquidity({
          protocol,
          wallet,
          tokenId: "7053",
          percentageToDecrease: "1000",
          deadline: "4321",
        })).to.be.rejectedWith("Deadline minutes must be lesser than 4320 (72hours)")
      })

      it('decreaseLiquidity - should fail (negative deadline provided)', async () => {
        await expect(sdk.uniswap.decreaseLiquidity({
          protocol,
          wallet,
          tokenId: "7053",
          percentageToDecrease: "1000",
          deadline: '-1',
        })).to.be.rejectedWith('Deadline minutes must be a positive amount')
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
          tokenIn:  AtokenAddress, 
          tokenOut: BtokenAddress, 
          amountIn: "100", 
        })

        await expect(sdk.uniswap.swap({
          wallet,
          transaction: swapQuote
        })).to.be.rejectedWith("insufficient funds")
      })

      it('swap - should fail (insufficient native funds)', async () => {
        const swapQuote = await sdk.uniswap.getSwapQuotation({
          wallet,
          protocol,
          tokenIn:  'matic', 
          tokenOut: BtokenAddress, 
          amountIn: "100", 
        })

        await expect(sdk.uniswap.swap({
          wallet,
          transaction: swapQuote
        })).to.be.rejectedWith("insufficient funds")
      })
    
      it('mintPosition - should fail (insufficient tokens)', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: "0x500e45883F2D25e62af5cb20c45187d5D06472df", // token-token
          amountTokenA: '10000000',
          minPriceDelta: '10',
          maxPriceDelta: '10',
        })

        await expect(sdk.uniswap.mintPosition({
          wallet,
          transaction: mintPositionQuotation
        })).to.be.rejectedWith("insufficient funds")

        
      })

      it('mintPosition - should fail (insufficient native funds)', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: "0x60B01823b126CA3aaf2361607300e32C0634f25D", // matic- token
          amountTokenA: '10',
          minPriceDelta: '10',
          maxPriceDelta: '10',
        })

        await expect(sdk.uniswap.mintPosition({
          wallet,
          transaction: mintPositionQuotation
        })).to.be.rejectedWith("insufficient funds")

      })

      it('increaseLiquidity - should fail (insufficient tokens)', async () => {
        await expect(sdk.uniswap.increaseLiquidity({
          protocol,
          wallet,
          tokenId: "7244",
          token0amount: "1", // t2
          token1amount: "0.1", // matic
          wrapped: true
        })).to.be.rejectedWith("insufficient funds")
      })

      it('increaseLiquidity - should fail (insufficient native funds)', async () => {
        await expect(sdk.uniswap.increaseLiquidity({
          protocol,
          wallet,
          tokenId: "7113",
          token0amount: "0.1",
          token1amount: "0.1",
        })).to.be.rejectedWith("insufficient funds")
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
          pool: "0xe238dcFa13E14a7108e821F07321597D5bdD6A96",
          amountTokenA: '10000000',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          // wrapped: true
        })
        await expect(sdk.uniswap.mintPosition({
          wallet,
          transaction: mintPositionQuotation
        })).to.be.rejectedWith("First Approve")
      })

      it('swap - should fail (no token approval)', async () => {
        const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
          wallet,
          protocol,
          pool: "0xe238dcFa13E14a7108e821F07321597D5bdD6A96",
          amountTokenA: '10000000',
          minPriceDelta: '10',
          maxPriceDelta: '10',
          // wrapped: true
        })
        await expect(sdk.uniswap.mintPosition({
          wallet,
          transaction: mintPositionQuotation
        })).to.be.rejectedWith("First Approve")
      })

      it('increase liquidity - should fail (no token approval)', async () => {
        await expect(sdk.uniswap.increaseLiquidity({
          protocol,
          wallet,
          tokenId: "7917",
          token0amount: "1",
          token1amount: "1",
        })).to.be.rejectedWith("First Approve")
      })

    })
  })

})

// async function run() {
//   // const protocol = 'POLYGON'
//   // const wallet = await sdk.wallet.generateWalletFromPrivateKey({
//   //   privateKey: process.env.PRIVATE_KEY_DEV02,
//   //   protocol: 'POLYGON',
//   // })
//   // console.log(wallet.address)

//   // const AtokenAddress = "0xE3031a696aDE55789371CEA339d5fbCF2B6339f9" //t1
//   // const BtokenAddress = "0xFf432f16F3d84eD1985EdFed30203F99d57Fe979" //t2
//   // const VD = "0xd6666D2C4e00e5C0f96BC5956Fe514f0f1A4f0AB" //VD
//   // const TCO = "0xa4F1C1DA64A29D1A8D7F72700D48826B181f0441" //TC0

//   // const createPool = await sdk.uniswap.createPool({
//   //   wallet,
//   //   protocol,
//   //   fee: 10000,
//   //   tokenA: AtokenAddress,
//   //   tokenB: BtokenAddress,
//   //   price: '999782',
//   // })
//   // console.log(createPool)

//   // const mintPositionQuotation = await sdk.uniswap.getMintPositionQuotation({
//   //   wallet,
//   //   protocol,
//   //   pool: "0x500e45883F2D25e62af5cb20c45187d5D06472df",
//   //   // amountTokenA: '1',
//   //   amountTokenB: '0.1',
//   //   minPriceDelta: '10',
//   //   maxPriceDelta: '10',
//   //   // slippage: '0.5',
//   //   // wrapped: true
//   // })
//   // console.log('position: ',mintPositionQuotation)

//   // const mintPosition = await sdk.uniswap.mintPosition({
//   //   wallet,
//   //   transaction: mintPositionQuotation
//   // })
//   // console.log('position: ', mintPosition)


//   // const pools = await sdk.uniswap.getPools({
//   //   protocol,
//   //   tokenA: AtokenAddress,
//   //   tokenB: BtokenAddress,
//   // })
//   // console.log(pools)

//   // const poolData = await sdk.uniswap.getPoolData({
//   //   protocol,
//   //   poolAddress: "0x500e45883F2D25e62af5cb20c45187d5D06472df"
//   // })
//   // console.log({poolData})

//   // const swapQuotation = await sdk.uniswap.getSwapQuotation({
//   //   wallet,
//   //   protocol,
//   //   tokenIn: 'matic', 
//   //   tokenOut: BtokenAddress, 
//   //   amountIn: "0.1", 
//   //   // amountOut: "0.1", 
//   //   // slippage: "0.5",
//   //   // deadline: "30"
//   // })
//   // console.log("SwapQuotation - EXACT_INPUT", swapQuotation)


//   // const txSwap = await sdk.uniswap.swap({
//   //   wallet,
//   //   transaction: swapQuotation
//   // })
//   // console.log("txSwap", txSwap)

//   // const tx1 = await sdk.uniswap.getTokenIds({
//   //     protocol,
//   //     ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af',
//   //     // ownerAddress: '0x43a51e57cC67012688568Ae4E9df164B2d5b093d',
//   // })
//   // console.log("getTokenIds", tx1)

//   // const tx2 = await sdk.uniswap.getPositions({
//   //     protocol,
//   //     ownerAddress: '0xb6A5DE345Ecb02460d8372Ea6bBB6127A14123Af',
//   //     // ownerAddress: '0x43a51e57cC67012688568Ae4E9df164B2d5b093d',
//   //     // poolAddress: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C'
//   // })
//   // console.log("getPositions", tx2)

//   // const tx3 = await sdk.uniswap.getPosition({
//   //   protocol,
//   //   tokenId: "7051"
//   // })
//   // console.log({tx3})

//   // const tx4 = await sdk.uniswap.collectFees({
//   //   protocol,
//   //   wallet,
//   //   tokenId: "7113",
//   //   wrapped: true
//   // })
//   // console.log({tx4})

//   // const tx4 = await sdk.uniswap.increaseLiquidity({
//   //   protocol,
//   //   wallet,
//   //   tokenId: "7113",
//   //   token0amount: "0.1",
//   //   token1amount: "0.1",
//   //   slippage: '0.5',
//   //   wrapped: true
//   // })
//   // console.log({tx4})

//   // const tx5 = await sdk.uniswap.decreaseLiquidity({
//   //   protocol,
//   //   wallet,
//   //   tokenId: "7053",
//   //   percentageToDecrease: "1000",
//   //   slippage: '5',
//   //   recipient: wallet.address,
//   //   // burnToken: true
//   //   wrapped: true
//   // })
//   // console.log({tx5})

//   // const tx6 = await sdk.uniswap.observePool({
//   //   protocol,
//   //   pool: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
//   //   secondsAgoToCheck: [3600000, 0]
//   // })
//   // console.log({tx6})

//   // const tx6 = await sdk.uniswap.increaseCardinality({
//   //   protocol,
//   //   pool: '0xC9d335CB5D4859090f1F8f67643441B6d330de0C',
//   //   wallet,
//   //   cardinality: 2
//   // })
//   // console.log({tx6})

// }
// run()
