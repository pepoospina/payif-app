import { useState } from 'react'

export interface UseCopyToClipboard {
  copied: boolean
  copy: (text: string) => Promise<void>
}

export const useCopyToClipboard = (): UseCopyToClipboard => {
  const [copied, setCopied] = useState<boolean>(false)

  const copy = async (text: string): Promise<void> => {
    return navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  return {
    copied,
    copy,
  }
}
