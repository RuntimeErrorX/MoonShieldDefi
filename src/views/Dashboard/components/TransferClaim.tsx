import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import * as bsc from '@binance-chain/bsc-use-wallet'
import Button from '../../../components/Button'
import rewardPool from '../../../assets/img/reward_pool.png'
import MSHLDABI from '../../../constants/abi/moonshield.json'
import { claimBNBReward } from '../../../tokencontract/utils'
import useTokenContract from '../../../hooks/useTokenContract'
import { MSHLDTokenAddress } from '../../../constants/tokenAddresses'

const StyledArea = styled.div`
  box-sizing: border-box;
  margin: 0px;
  width: 100%;
  padding: 20px;
  margin-bottom: 40px;
  position: relative;
  font-family: 'Catamaran';  
  border: 3px solid rgba(255,255,255,.2)!important;
  border-radius: 5px;
  background: linear-gradient(90deg,rgba(0,0,0,.67) 0,rgba(42,45,52,.49) 75%);
  border-bottom: 3px solid var(--moonshield)!important;
  border-radius-bottom: 15px;
  color: #fff;    
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-bottom: 20px;
`
const StyledClaim = styled.div`
  background: linear-gradient(0deg, rgba(0,0,0,0.67) 0%, rgba(42,45,52,0.49) 75%);
  border: 3px solid rgba(255,255,255,0.2);
  border-bottom: 3px solid var(--moonshield);
  border-radius: 0 0 15px 15px;
`

const StyledContainer = styled.div`
    background: linear-gradient(0deg, rgba(0,0,0,0.67) 0%, rgba(42,45,52,0.49) 75%);
    border: 3px solid rgba(255,255,255,0.2);
    border-bottom: 3px solid var(--moonshield);
    border-radius: 0 0 15px 15px;
`

const StyledTitle = styled.div`
    z-index: 3;
    float: left;
    position: relative;
    top: 10px;
`

const StyledIconArea = styled.div`
  border-right: 2px solid #ffc107;
  text-align: center;
  padding: 0.25rem !important;
  -ms-flex: 0 0 25%;
  flex: 0 0 25%;
  max-width: 25%;
`

const StyledInfoArea = styled.div`
  align-self: left;
  text-align: left;
  padding: 0.5rem !important;
  -ms-flex: 0 0 75%;
  flex: 0 0 75%;
  max-width: 75%;
`

const StyledClaimButtonArea = styled.div`
  max-width: 50%;
  margin-top: 10px;
  margin-left: 25%;
  borderRadius: 20px;
`

const StyledIcon = styled.div`
  text-align: center;
  position: relative;
  margin-top: 0px;
  @media (max-width: 767px) {
    left: 0px;
  }
`

const TransferClaim: React.FC = () => {
  const history = useHistory()
  const [calculatedReward, setCalculatedReward] = useState(0)
  const [BNBRewardPool, setRewardPool] = useState('')

  const wallet = bsc.useWallet()

  if (wallet.account == null) {
    history.push('/')
  }

  const web3 = new Web3(
    new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'),
  )

  const MSHLDContract = new web3.eth.Contract(
    MSHLDABI as unknown as AbiItem,
    MSHLDTokenAddress,
  )

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(MSHLDTokenAddress)
    setRewardPool(
      web3.utils.fromWei(web3.utils.toBN(balance).toString(), 'ether'),
    )
  }

  const getMaxTransactionAmount = async () => {
    if (wallet.account) {
      const reward = await MSHLDContract.methods
        .calculateBNBReward(wallet.account)
        .call()
      setCalculatedReward(reward / 1000000000000000000)
    }
  }

  const tokenContract = useTokenContract()

  const handleClaimClick = () => {
    claimBNBReward(tokenContract)
  }

  getMaxTransactionAmount()
  getBalance()

  return (    
    <>    
        <div className="container mb-5 container-fluid" style={{paddingLeft:'0px', paddingRight:'0px'}}>
        <StyledClaim className="row d-flex flex-wrap flex-column mt-5 m-0">
                <StyledContainer className="row d-flex flex-wrap flex-grow-1 flex-column mt-5 m-0">
                    <div className="col p-3">
                        <section className="features-blue m-0 p-0 border-dot dapp-block">
                            <StyledTitle className="intro mb-0">
                                <p className="d-flex flex-grow-1 text-white">Disruptive transfer between 2 wallets</p>
                                <p className="d-flex flex-grow-1 text-white">Balance: 999999 $MSHLD</p>
                            </StyledTitle>
                        </section>
                    </div>
                    <div className="col">
                        <section className="features-blue m-0 p-3 border-dot dapp-block mb-3">
                            <form className="m-0 p-0">
                                <div className="row">
                                    <div className="col col-12">
                                        <div className="row w-100 d-flex flex-column flex-wrap flex-grow-1">
                                            <div className="col text-start m-2">
                                                <label className="form-label">Recipient (address)</label>
                                                <input className="form-control form-dark" type="text"></input>
                                            </div>
                                            <div className="col text-start m-2">
                                                <label className="form-label">Amount ($MSHLD)</label>
                                                <input className="form-control form-dark" type="text"></input>
                                            </div>
                                            <div className="col text-start m-2">
                                                <a className="btn btn-primary font-monospace btn-lg btn-border bg-primary carbon-bg-gray" role="button" data-bs-toggle="tooltip" data-bss-tooltip="" href="#" title=" A transfer (between 2 wallets) that is more than 0.05% of the total supply will be charged for 2 BNB.">
                                                    Send
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>
                </StyledContainer>
            </StyledClaim>
        </div>
    </>
  )
}

export default TransferClaim
