export const calculateExchangeRate = (sendValue: string | null, receiveValue: string | null) => {
  if (!sendValue || !receiveValue || !Number(receiveValue) || !Number(sendValue)) {
    return 0
  }
  return Number(receiveValue) / Number(sendValue)
}

export enum ExpirationType {
  MINUTES = 'Minutes',
  HOURS = 'Hours',
  DAYS = 'Days',
  WEEKS = 'Weeks',
  MONTHS = 'Months',
}

export const ExpirationMultiplier = {
  [ExpirationType.MINUTES]: 60,
  [ExpirationType.HOURS]: 60 * 60,
  [ExpirationType.DAYS]: 60 * 60 * 24,
  [ExpirationType.WEEKS]: 60 * 60 * 24 * 7,
  [ExpirationType.MONTHS]: 60 * 60 * 24 * 30,
}

export const formatExpirationFromDate = (expiration: number) => {
  let formattedDate = ''
  let remaining = expiration - Date.now() / 1000
  if (remaining <= 0) return 'Expired'

  if (Math.floor(remaining / ExpirationMultiplier[ExpirationType.MONTHS]) > 0) {
    formattedDate += `${Math.floor(remaining / ExpirationMultiplier[ExpirationType.MONTHS])}mo : `
    remaining %= ExpirationMultiplier[ExpirationType.MONTHS]
  }

  if (Math.floor(remaining / ExpirationMultiplier[ExpirationType.WEEKS]) > 0) {
    formattedDate += `${Math.floor(remaining / ExpirationMultiplier[ExpirationType.WEEKS])}w : `
    remaining %= ExpirationMultiplier[ExpirationType.WEEKS]
  }

  if (Math.floor(remaining / ExpirationMultiplier[ExpirationType.DAYS]) > 0) {
    formattedDate += `${Math.floor(remaining / ExpirationMultiplier[ExpirationType.DAYS])}d : `
    remaining %= ExpirationMultiplier[ExpirationType.DAYS]
  }

  if (Math.floor(remaining / ExpirationMultiplier[ExpirationType.HOURS]) > 0) {
    formattedDate += `${Math.floor(remaining / ExpirationMultiplier[ExpirationType.HOURS])}h : `
    remaining %= ExpirationMultiplier[ExpirationType.HOURS]
  }

  if (Math.floor(remaining / ExpirationMultiplier[ExpirationType.MINUTES]) > 0) {
    formattedDate += `${Math.floor(remaining / ExpirationMultiplier[ExpirationType.MINUTES])}m : `
    remaining %= ExpirationMultiplier[ExpirationType.MINUTES]
  }

  if (remaining > 0) {
    formattedDate += `${Math.floor(remaining)}s : `
  }

  return formattedDate.substring(0, formattedDate.length - 3)
}
