import _ from 'lodash'
import locale2 from 'locale2'
import { LocaleType, LocaleMessageType } from '../types/LocaleTypes'
import en_us from './messages/en_US.json'
import zh_cn from './messages/zh_CN.json'
import zh_tw from './messages/zh_TW.json'
import ja_jp from './messages/ja.json'
import fr_fr from './messages/fr_FR.json'
import ru_ru from './messages/ru_RU.json'
import de_de from './messages/de_DE.json'
import ko_kr from './messages/ko.json'

const messages = {
  en_us,
  zh_cn,
  zh_tw,
  ja_jp,
  fr_fr,
  ru_ru,
  de_de,
  ko_kr,
}

const localeAliases = {
  // browsers don't always define the specificity required for the locale packs
  en: 'en-US',
  ja: 'ja-JP',
  ru: 'ru-RU',
  de: 'de-DE',
  ko: 'ko-KR',
}

export const getAliasedLocale = (locale: LocaleType) => localeAliases[locale]

export const localeMetadata = {
  en_us: {
    locale: 'en-US',
    name: 'English (US)',
  },
  ru_ru: {
    locale: 'ru-RU',
    name: 'Russian',
  },
  de_de: {
    locale: 'de-DE',
    name: 'German',
  },
  fr_fr: {
    locale: 'fr-FR',
    name: 'French',
  },
  ko_kr: {
    locale: 'ko-KR',
    name: 'Korean',
  },
  // nl_nl: {  // doesn't seem like we have dutch translation data right now
  //   locale: 'nl-NL',
  //   name: 'Dutch'
  // },
  zh_CN: {
    locale: 'zh-CN',
    name: 'Chinese (Simplified)',
  },
  zh_TW: {
    locale: 'zh-TW',
    name: 'Chinese (Traditional)',
  },
  ja_jp: {
    locale: 'ja-JP',
    name: 'Japanese',
  },
}

type LocaleAliasType = 'en-US' | 'ja-JP' | 'ru-RU' | 'de-DE' | 'ko-KR'

export const formatLocaleSnakeCase = (locale: LocaleAliasType | LocaleType): LocaleMessageType => {
  const newLocale = locale.replace(/-/g, '_').toLocaleLowerCase() as LocaleMessageType

  return newLocale
}

export const checkLocale = (locale: LocaleType) => _.has(messages, formatLocaleSnakeCase(locale))

const userLocale = checkLocale(locale2) ? locale2 : getAliasedLocale(locale2)

if (userLocale) {
  console.log(`Using user default locale: ${userLocale}`)
} else {
  // fall back to 'en-US'
  console.log('Defaulting to locale: en-US')
}

export const applicationLocale = userLocale || 'en-US'

export default messages
