import React from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'
import { connect } from 'react-redux'

import messages, { formatLocaleSnakeCase } from '../../locales'
import { selectors as localeSelectors } from '../../state/locale/reducers'
import { LocaleType } from '../../types/LocaleTypes'

const { getLocale } = localeSelectors

const IntlWrapper = ({ locale, children }: { locale: LocaleType; children: React.ReactNode }): any => {
  const key = formatLocaleSnakeCase(locale)

  const localeMessages = messages[key]

  // We need to render inside IntlWrapper to ensure that messages are updated before rendering rest of the app
  // key prop is passed in to re-render app when locale changes
  return (
    <ReactIntlProvider locale={locale} messages={localeMessages} key={locale}>
      {children}
    </ReactIntlProvider>
  )
}

const IntlProvider = connect(
  state => ({
    locale: getLocale(state),
  }),
  {},
)(IntlWrapper)

export default (Component: React.ComponentType<any>) => (props: any) => (
  <IntlProvider>
    <Component {...props} />
  </IntlProvider>
)
