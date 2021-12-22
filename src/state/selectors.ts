import { ETH_ADDRESS, WETH_CONTRACT_ADDRESS } from 'airswap.js/src/constants'
import { selectors as balancesSelectors } from 'airswap.js/src/deltaBalances/redux'
import BigNumber from 'bignumber.js'
import { createSelector } from 'reselect'

const { getBalances } = balancesSelectors

export const makeGetBalanceForToken = createSelector(
  getBalances,
  (balances: any) => (walletAddress: string, tokenAddress: string, combine?: boolean) => {
    const walletBalance = balances[walletAddress]
    if (walletBalance === undefined) return undefined
    if (!walletBalance) return 0

    // If ETH/WETH, return sum of the two
    if (combine && (tokenAddress === ETH_ADDRESS || tokenAddress === WETH_CONTRACT_ADDRESS)) {
      return new BigNumber(walletBalance[ETH_ADDRESS])
        .add(new BigNumber(walletBalance[WETH_CONTRACT_ADDRESS]))
        .toString()
    }

    return walletBalance[tokenAddress]
  },
)
