import { checkLocale } from '../../locales'

export const defaultState = 'en-US'

const locale = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_LOCALE':
      const isLocaleSupported = checkLocale(action.locale)
      if (!isLocaleSupported) {
        console.warn(`Provided locale not supported: ${action.locale}`)
        console.warn('Defaulting to locale: en-US')
      }
      return isLocaleSupported ? action.locale : 'en-US'
    default:
      return state
  }
}

export default locale

const getLocale = state => state.locale

export const selectors = {
  getLocale,
}
