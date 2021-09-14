import {
  CONNECT_WALLET,
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAIL,
} from './constants'
import getContracts, {ethereum, walletLink} from '../Blockchain/contracts'
// Real Network

// const data = [
//   {
//     chainId: '0x89',
//     chainName: 'Polygon Mainnet',
//     nativeCurrency: {
//       name: 'MATIC',
//       symbol: 'MATIC',
//       decimals: 18,
//     },
//     rpcUrls: ['https://polygon-rpc.com/'],
//     blockExplorerUrls: ['https://www.polygonscan.com/'],
//   },
// ]

// Test Network

// const data = [
//   {
//     chainId: '0x13881',
//     chainName: 'Polygon Testnet',
//     nativeCurrency: {
//       name: 'MATIC',
//       symbol: 'MATIC',
//       decimals: 18,
//     },
//     rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
//     blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
//   },
// ]

const data = [
  {
    chainId: '0x13881',
    chainName: 'Polygon Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
]

// actions

export const checkAndAddNetwork = () => async (dispatch) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: data[0]?.chainId}],
    })
    dispatch(getProfileInformation())
  } catch (error) {
    console.log(error)
    if (error?.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: data,
        })
        dispatch(getProfileInformation())
      } catch (addError) {
        console.error(addError?.message)
      }
    }
  }
}
export const connToMetaMask = () => async (dispatch) => {
  try {
    dispatch(checkAndAddNetwork())
    const userAddress = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    dispatch({
      type: CONNECT_WALLET,
      payload: userAddress[0],
      walletType: 'MetaMask',
    })
  } catch (error) {
    console.error(error?.message)
  }
}

export const connToCoinbase = () => async (dispatch) => {
  try {
    dispatch(checkAndAddNetwork())
    const accounts = await ethereum.enable()
    // coinbaseWeb3.eth.defaultAccount = accounts[0]
    dispatch({
      type: CONNECT_WALLET,
      payload: accounts[0],
      walletType: 'Coinbase',
    })
  } catch (error) {
    console.error(error?.message)
  }
}
export const disConnectWallet = () => async () => {
  // web3.currentProvider._handleDisconnect();
  walletLink.disconnect()
}
export const getProfileInformation = () => async (dispatch, getState) => {
  try {
    const {
      profile: {userAddress, walletType},
    } = getState()
    dispatch({
      type: PROFILE_REQUEST,
    })

    if (userAddress) {
      const {web3, usdc, cpt, crt} = getContracts(walletType)
      // available Balance
      const balance = await usdc.methods.balanceOf(userAddress).call()
      const availableBalance = web3.utils.fromWei(balance.toString(), 'ether')

      const totalRewardsEarned = 0,
        cptLPBalance = 0,
        crtLPBalance = 0

      // CPT and CRT
      const cptB = await cpt.methods.balanceOf(userAddress).call()
      const crtB = await crt.methods.balanceOf(userAddress).call()
      const cptBalance = web3.utils.fromWei(cptB.toString(), 'ether')
      const crtBalance = web3.utils.fromWei(crtB.toString(), 'ether')

      dispatch({
        type: PROFILE_SUCCESS,
        payload: {
          availableBalance: Number(availableBalance),
          totalRewardsEarned,
          cptBalance: Number(cptBalance),
          crtBalance: Number(crtBalance),
          cptLPBalance,
          crtLPBalance,
        },
      })
    }
  } catch (error) {
    dispatch({
      type: PROFILE_FAIL,
      payload: error?.message,
    })
  }
}
