import { useWeb3Modal, useWeb3ModalEvents } from '@web3modal/wagmi/react'
import { use } from 'i18next'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { WalletClient } from 'viem'
import { useDisconnect, useWalletClient } from 'wagmi'

import { useLoadingContext } from '../contexts/LoadingContext'
import { I18Keys } from '../i18n/kyel.list'
import { HexStr } from '../shared/types'
import { cap } from '../utils/general'
import { createMagicSigner, magic } from './magic.signer'

export type SignerContextType = {
  connect: () => void
  hasInjected: boolean
  signer?: WalletClient
  address?: HexStr
  signMessage?: (message: string) => Promise<HexStr>
  isConnecting: boolean
  errorConnecting?: Error
  disconnect: () => void
}

const ProviderContextValue = createContext<SignerContextType | undefined>(undefined)

const HAD_MAGIC_KEY = 'hadMagic'

export const SignerContext = (props: PropsWithChildren) => {
  const { t } = useTranslation()
  const { open: openLoading, close: closeLoading } = useLoadingContext()
  const { open: openConnectModal } = useWeb3Modal()
  const modalEvents = useWeb3ModalEvents()

  const [address, setAddress] = useState<HexStr>()
  const [magicSigner, setMagicSigner] = useState<WalletClient>()

  const { data: injectedSigner } = useWalletClient()

  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [errorConnecting, setErrorConnecting] = useState<Error>()

  const signer: WalletClient | undefined = injectedSigner ? injectedSigner : magicSigner

  /** check for users */
  useEffect(() => {
    /**
     * show loading when first loading a page
     * (to cover the time where the connected account is checked)
     * */
    const hadMagic = localStorage.getItem(HAD_MAGIC_KEY)

    /** try to restate magic*/
    if (hadMagic !== null && hadMagic === 'true') {
      openLoading({
        title: t([I18Keys.loadingProfile]),
        subtitle: t([I18Keys.justAMoment]),
      })

      magic.user.isLoggedIn().then((res: any) => {
        console.log('Magic is logged in', { res })
        if (res && !magicSigner) {
          console.log('Autoconnecting Magic')
          connectMagic(false)
        } else {
          closeLoading()
        }
      })

      magic.user.onUserLoggedOut((isLoggedOut: boolean) => {
        if (isLoggedOut) {
          setMagicSigner(undefined)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (signer) {
      if (injectedSigner) {
        setAddress(injectedSigner.account.address)
      } else {
        if (!magicSigner) throw new Error('unexpected')
        ;(magicSigner as any).getAddresses().then((addresses: HexStr[]) => {
          setAddress(addresses[0])
        })
      }
    } else {
      setAddress(undefined)
    }
  }, [signer])

  const { disconnect: disconnectInjected } = useDisconnect()

  const connectMagic = (useUI: boolean) => {
    console.log('connecting magic signer', { signer })
    setIsConnecting(true)
    createMagicSigner(useUI).then((signer) => {
      console.log('connected magic signer', { signer })
      setIsConnecting(false)
      setMagicSigner(signer)
      localStorage.setItem(HAD_MAGIC_KEY, 'true')
    })
  }

  const connectInjected = () => {
    openConnectModal()
  }

  useEffect(() => {
    console.log(modalEvents.data.event)
    if (modalEvents.data.event === 'MODAL_CLOSE') {
      closeLoading()
    }
  }, [modalEvents])

  const hasInjected = (window as any).ethereum !== undefined

  const connect = () => {
    openLoading({
      title: t([I18Keys.connectingUser]),
      subtitle: t([I18Keys.connectWallet]),
    })

    try {
      if (hasInjected) {
        connectInjected()
        return
      }

      connectMagic(true)
      return
    } catch (error) {
      console.log(error)
    }
  }

  const _signMessage = useCallback(
    (message: string) => {
      if (!signer || !address)
        throw new Error('Unexpected signer or address undefined and signMessage called')
      return (signer as any).signMessage({ account: address, message })
    },
    [address, signer],
  )

  /** set signMessage as undefined when not available */
  const signMessage = !signer || !address ? undefined : _signMessage

  const disconnect = () => {
    disconnectInjected()

    magic.user.logout()
    setMagicSigner(undefined)
  }

  return (
    <ProviderContextValue.Provider
      value={{
        connect,
        isConnecting,
        errorConnecting,
        signMessage,
        hasInjected,
        signer: signer as any,
        address,
        disconnect,
      }}
    >
      {props.children}
    </ProviderContextValue.Provider>
  )
}

export const useAppSigner = (): SignerContextType => {
  const context = useContext(ProviderContextValue)
  if (!context) throw Error('context not found')
  return context
}
