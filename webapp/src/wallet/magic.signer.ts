import { Magic } from 'magic-sdk'
import { createWalletClient, custom } from 'viem'

import { MAGIC_API_KEY } from '../config/appConfig'
import { chain } from './ConnectedWalletContext'

// instantiate Magic SDK instance
export const magic = new Magic(MAGIC_API_KEY, { useStorageCache: true })

// NOTE: because this is async, you will need to put this in a useEffect hook if using React
export const createMagicSigner = async (useUI: boolean) => {
  if (useUI) {
    // 1. Authenticate the user (for other methods see magic docs https://magic.link/docs/dedicated/overview)
    await magic.wallet.connectWithUI()
  }

  // 2. create a wallet client
  const magicClient = createWalletClient({
    transport: custom(await magic.wallet.getProvider()),
    chain: chain,
  })

  return magicClient
}
