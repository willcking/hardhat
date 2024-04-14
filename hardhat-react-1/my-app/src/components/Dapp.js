import React from 'react'

import { ethers } from 'ethers'


import simpleTokenArtifact from '../contracts/SimpleToken.json'
import contractAddress from '../contracts/contract-address.json'

import { NoWalletDetected } from './NoWalletDetected'
import { ConnectWallet } from './ConnectWallet'
import { Loading } from './Loading'
import { Transfer } from './Transfer'
import { TransactionErrorMessage } from './TransactionErrorMessage'
import { WaitingForTransactionMessage } from './WaitingForTransactionMessage'
import { NoTokensMessage } from './NoTokensMessage'

const HARDHAT_NETWORK_ID = '31337'

const ERROR_CODE_TX_REJECTED_BY_USER = 4001


let simpleTokenContractAddress = contractAddress.contractAddress

export class Dapp extends React.Component {
  constructor(props) {
    super(props)

    this.initialState = { 
      tokenData: undefined,
      selectedAddress: undefined,
      balance: undefined,
      txBeingSent: undefined,
      deployBegin: undefined,
      transactionError: undefined,
      networkError: undefined,
      decimals: undefined,
    }

    this.state = this.initialState
  }
 
  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (!this._checkNetwork()) {
      return
    }
  
    this._initialize(selectedAddress)

    window.ethereum.on('accountsChanged', ([newAddress]) => {
      this._stopPollingData()

      if (newAddress === undefined) {
        return this._resetState()
      }

      this._initialize(newAddress)
    })

    window.ethereum.on('chainChanged', ([_chainId]) => {
      this._stopPollingData()
      this._resetState()
    })
  }

  _initialize(userAddress) {

    this.setState({
      selectedAddress: userAddress,
    })

    this._intializeEthers()
    this._getTokenData()
    this._startPollingData()
  }

  async _intializeEthers() {

    this._provider = new ethers.providers.Web3Provider(window.ethereum)

    this._simpleToken = new ethers.Contract(
      simpleTokenContractAddress,
      simpleTokenArtifact.abi,
      this._provider.getSigner(0)
    )

    this.setState({decimals: await this._simpleToken.decimals()})
  }

  async _updateBalance() {
    const balance = await this._simpleToken.balanceOf(
      this.state.selectedAddress
    )
    this.setState({ balance })
  }

  async _getTokenData() {
    const name = await this._simpleToken.name()
    const symbol = await this._simpleToken.symbol()

    this.setState({ tokenData: { name, symbol } })
  }

  async _transferTokens(to, amount) {
    try {
      this._dismissTransactionError()
      const tx = await this._simpleToken.transfer(to, amount)
      this.setState({ txBeingSent: tx.hash })
      const receipt = await tx.wait()
      if (receipt.status === 0) {
        throw new Error('Transaction failed')
      }
      await this._updateBalance()
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return
      }
      console.error(error)
      this.setState({ transactionError: error })
    } finally {
      this.setState({ txBeingSent: undefined })
    }
  }

  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000)

    this._updateBalance()
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval)
    this._pollDataInterval = undefined
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true
    }

    this.setState({
      networkError: 'Please connect Metamask to Hardhat Host',
    })

    return false
  }

  _resetState() {
    this.setState(this.initialState)
  }

  _dismissNetworkError() {
    this.setState({ networkError: undefined })
  }

  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message
    }

    return error.message
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined })
  }

  render() {
    if (window.ethereum === undefined) {
      return <NoWalletDetected />
    }

    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      )
    }

    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />
    }

    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              {this.state.tokenData.name} ({this.state.tokenData.symbol})
            </h1>
            <p>
              Welcome <b>{this.state.selectedAddress}</b>, you have{' '}
              <b>
                {ethers.utils.formatUnits(this.state.balance, this.state.decimals)} {this.state.tokenData.symbol}
              </b>
              .
            </p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
          {this.state.balance.eq(0) && (
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
            )}
            
            {this.state.balance.gt(0) && (
              <Transfer
                transferTokens={(to, amount) =>
                  this._transferTokens(to, ethers.utils.parseUnits(amount, this.state.decimals))
                }
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}
