import { addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import ja from 'react-intl/locale-data/ja'
import fr from 'react-intl/locale-data/fr'
import ru from 'react-intl/locale-data/ru'
import de from 'react-intl/locale-data/de'
import ko from 'react-intl/locale-data/ko'

export default () => {
  addLocaleData([...en, ...zh, ...ja, ...fr, ...ru, ...de, ...ko])
}
