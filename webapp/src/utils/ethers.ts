import { BigNumber, ethers } from 'ethers'

export function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.')
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits)
  }
  return str
}

export const formatEther = (wei: string | BigNumber | number, decimals: number = 4) => {
  const str = ethers.utils.formatEther(wei).toString()
  return truncate(str, decimals)
}

export const parseCssUnits = (size: string): [value: number, units: string] => {
  const reg = new RegExp('(\\d+\\s?)(\\w+)')
  const parts = reg.exec(size)

  if (parts === null) {
    throw new Error(`size wrong`)
  }

  const value = +parts[1]
  const units = parts[2]
  return [value, units]
}
