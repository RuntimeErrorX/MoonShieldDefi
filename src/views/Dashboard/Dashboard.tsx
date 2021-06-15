import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import { Input } from '@material-ui/core'
import * as bsc from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import { useMediaQuery } from 'react-responsive'
import MoonShieldABI from '../../constants/abi/moonshield.json'
import WBNBABI from '../../constants/abi/WBNB.json'
import GetTimeABI from '../../constants/abi/GettingTime.json'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import mainImg from '../../assets/img/logoletras.svg'
import bnbInPool from '../../assets/img/bnb_in_pool.png'
import currentPrice from '../../assets/img/current_price.png'
import liquidityPool from '../../assets/img/liquidity_pool.png'
import maxAmount from '../../assets/img/max_transaction_amount.png'
import rewardPool from '../../assets/img/reward_pool.png'
import { useHistory } from 'react-router-dom'
import WriteClaim from './components/WriteClaim'
import ReadContractItem from './components/ReadContractItem'
import AccountButton from '../../components/TopBar/components/AccountButton'
import TopBar from '../../components/TopBar'
import Hero from '../../../src/components/Hero'
import DappInfo from '../../../src/components/DappInfoCard'
import { claimBNBReward } from '../../tokencontract/utils'
import {
  MSHLDTokenAddress,
  MSHLDPairAddress,
  WBNBAddress,
  GetTimeAddress,
} from '../../constants/tokenAddresses'
import TransferClaim from './components/TransferClaim'
import { getBalance } from '../../utils/erc20'

const Home: React.FC = () => {
  const history = useHistory()
  const wallet = bsc.useWallet()

  if (wallet.account == null) {
    // history.push('/')
  }

  const [maxTransaction, setMaxTransaction] = useState('')
  const [totalBNB, setTotalBNB] = useState('')
  const [totalBNBValue, setTotalBNBValue] = useState(0)
  const [totalLiquidity, setTotalLiquidity] = useState('')
  const [BNBPrice, setBNBPrice] = useState(0)
  const [MSHLDPrice, setMSHLDPrice] = useState(0)
  const [currencyPrice, setCurrencyPrice] = useState('')
  const [currentBalance, setCurrencyBalance] = useState(0)
  const [BNBRewardPool, setRewardPool] = useState('')
  // const [] = useState()

  const web3 = new Web3(
    new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'),
  )

  const MSHLDContract = new web3.eth.Contract(
    MoonShieldABI as unknown as AbiItem,
    MSHLDTokenAddress,
  )

  const WBNBContract = new web3.eth.Contract(
    WBNBABI as unknown as AbiItem,
    WBNBAddress,
  )

  const getBNBPrice = async () => {
    const prices = await fetch(
      'https://api3.binance.com/api/v3/ticker/price',
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    })
    setBNBPrice(prices[98].price)
  }

  const getMaxTransactionAmount = async () => {
    const maxTransactionAmount = await MSHLDContract.methods
      ._maxTxAmount()
      .call()
    setMaxTransaction('$MSHLD ' + maxTransactionAmount / 1000000000)
  }

  const getTotalBNBInLiquidityPool = async () => {
    const totalBNBInLiquidityPool = await WBNBContract.methods
      .balanceOf(MSHLDPairAddress)
      .call()
    setTotalBNBValue(totalBNBInLiquidityPool)
    setTotalBNB(
      web3.utils.fromWei(
        web3.utils.toBN(totalBNBInLiquidityPool).toString(),
        'ether',
      ) + ' BNB',
    )
  }

  const getCurrentMSHLDPrice = async () => {
    const totalBNBInLiquidityPool = await WBNBContract.methods
      .balanceOf(MSHLDPairAddress)
      .call()
    const totalMSHLDInLiquidityPool = await MSHLDContract.methods
      .balanceOf(MSHLDPairAddress)
      .call()

    const price = web3.utils
      .toBN(totalBNBInLiquidityPool)
      .div(web3.utils.toBN(totalMSHLDInLiquidityPool))
      .toNumber()

    setMSHLDPrice(price / 1000000000)
    setCurrencyPrice((price / 1000000000).toString() + ' BNB')
  }

  const getCurrentMSHLDBalance = async () => {
    if (wallet.account) {
      const balance = await MSHLDContract.methods
        .balanceOf(wallet.account)
        .call()
      setCurrencyBalance(web3.utils.toBN(balance).toNumber() / 1000000000)
    }
  }

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(MSHLDTokenAddress)
    setRewardPool(
      web3.utils.fromWei(web3.utils.toBN(balance).toString(), 'ether'),
    )
  }

  // const getTotalLiquidityPool = () => {
  //   console.log('pooh, totalBNBValue = ', totalBNBValue)
  //   setTotalLiquidity(
  //     '$ ' + ((totalBNBValue * BNBPrice) / 1000000000000000000).toString(),
  //   )
  // }

  getBNBPrice()
  getMaxTransactionAmount()
  getTotalBNBInLiquidityPool()
  getCurrentMSHLDPrice()
  getCurrentMSHLDBalance()
  getBalance()
  // getTotalLiquidityPool()

  return (
          <div style={{marginTop:'-1100px'}}>
            <Page>
              <Hero />
              <DappInfo
                  maxTransaction={ maxTransaction }
                  totolLP={ ((totalBNBValue * BNBPrice) / 1000000000000000000).toString() }
                  totalReward={ currentBalance.toString() }
                  BNBinLp={ totalBNB  }
                  BNBinRewardPool={ BNBRewardPool.toString() }
                  MSHLDBalance={ currentBalance.toString() }
              />
              <StyledRowArea>
                <StyledArea>
                  <WriteClaim />
                  <TransferClaim />
                </StyledArea>
              </StyledRowArea>
              <TopBar />
            </Page>
          </div>
  )
}

const StyledRowArea = styled.div`
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
`

const StyledDetail = styled.div`
  -ms-flex: 0 0 25%;
  flex: 0 0 25%;
  max-width: 25%;
`

const StyledArea = styled.div`
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
  padding: 10px;
  margin-top: 30px;
`

const StyledContractDetail = styled.div`
  width: 100;
  display: flex;
  margin-left: 15px;
  margin-right: 15px;
  flex-wrap: wrap;
  justify-content: space-between;
`

export default Home
