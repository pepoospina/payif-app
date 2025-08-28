export const WALLETCONNECT_PROJECT_ID = process.env.WALLETCONNECT_PROJECT_ID as string
export const MAGIC_API_KEY = process.env.MAGIC_API_KEY
export const CACHE_URLS_AND_PATHS: { origin: string; paths?: string[] }[] = [
  { origin: 'https://assets.auth.magic.link', paths: ['static', 'i18n'] },
  { origin: 'fonts.gstatic.com' },
  { origin: 'https://fonts.googleapis.com' },
  { origin: 'https://api.web3modal.com', paths: ['public'] },
  { origin: 'https://auth.magic.link', paths: ['_next/static'] },
]

export const ALCHEMY_KEY = process.env.ALCHEMY_KEY
export const ALCHEMY_KEY_ENS = process.env.ALCHEMY_KEY_ENS
export const ALCHEMY_GAS_POLICY_ID = process.env.ALCHEMY_GAS_POLICY_ID
export const ALCHEMY_RPC_URL = `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
export const ALCHEMY_RPC_URL_ENS = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY_ENS}`

export const BUILD_ID = process.env.REACT_APP_VERSION

export const FUNCTIONS_BASE = process.env.FUNCTIONS_BASE

export const CHAIN_ID = 84532
export const CHAIN_NAME = 'basesepolia'
export const CHAIN_EXPLORER_BASE = 'https://base-sepolia.blockscout.com/'

export const MIN_MEMBERS = 3
export const MIN_LIKES_PUBLIC = 2

export const SECONDS_IN_DAY = 86400

export const PENDING_PERIOD = 180 * SECONDS_IN_DAY
export const VOTING_PERIOD = 15 * SECONDS_IN_DAY
export const QUIET_ENDING_PERIOD = 2 * SECONDS_IN_DAY
