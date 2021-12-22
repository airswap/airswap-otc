export type LocaleType = 'en' | 'ja' | 'ru' | 'de' | 'ko'
export type LocaleMessageType = 'en_us' | 'zh_cn' | 'zh_tw' | 'ja_jp' | 'fr_fr' | 'ru_ru' | 'de_de' | 'ko_kr'
export interface IntlObject {
  intl: { formatMessage(string): string }
}
