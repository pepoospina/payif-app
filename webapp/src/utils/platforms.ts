import { PlatformId } from '../shared/types'

export interface PlatformDetails {
  name: string
  usernameUrl?: (username: string) => string
  iconUri?: string
  placeholder?: string
}

type Platforms = Partial<Record<PlatformId, PlatformDetails>>

export const platforms: Platforms = {
  [PlatformId.X]: {
    name: 'X/Twitter',
    usernameUrl: (username: string) => `https://x.com/${username}`,
  },
  [PlatformId.Telegram]: {
    name: 'Telegram',
    usernameUrl: (username: string) => `https://t.me/${username}`,
  },
  [PlatformId.Email]: {
    name: 'Email',
    usernameUrl: (username: string) => `mailto:${username}`,
  },
  [PlatformId.Whatsapp]: {
    name: 'Whatsapp',
    usernameUrl: (username: string) => `https://wa.me/${username}`,
  },
  [PlatformId.Facebook]: {
    name: 'Facebook',
    usernameUrl: (username: string) => `https://facebook.com/${username}`,
  },
  [PlatformId.Instagram]: {
    name: 'Instagram',
    usernameUrl: (username: string) => `https://instagram.com/${username}`,
  },
  [PlatformId.Discord]: {
    name: 'Discord',
    usernameUrl: (username: string) => `https://discordapp.com/users/${username}`,
  },
  [PlatformId.Custom]: {
    name: 'Custom',
    usernameUrl: (username: string) => `${username}`,
  },
}
