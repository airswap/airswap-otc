# i18n

## How to add locales

1. Ensure that locale is added to `/src/locales/config.js`
1. Add locale to `generateLocaleMessages` script in `/package.json`
1. Run `yarn generateLocaleMessages` to prepopulate newly added locale with
   empty strings

## react-intl

We use react-intl to handle our translations. Our toolkit includes
`extract-react-intl-messages` and `babel-plugin-react-intl` so that we can easily handle new translations
automatically

There are two ways to define messages handled by `react-intl`.

### `<FormattedMessage>` (preferred)

[API docs](https://github.com/yahoo/react-intl/wiki/Components#formattedmessage)

### `injectIntl` and `formatMessage`

[API docs](https://github.com/yahoo/react-intl/wiki/API#formatmessage)

_NOTE_: because we use `extract-react-intl-messages` to manage our json files,
you need to make sure to always call
[`defineMessages`](https://github.com/yahoo/react-intl/wiki/API#definemessages)
when using `injectIntl` and `formatMessage`. This is because the
`babel-plugin-react-intl` looks for this call to insert the message into the
generated json file

```
import { injectIntl, formatMessage, defineMessages } from 'react-intl'

const messages = {
  EXAMPLE: {
    id: 'features.example.index.EXAMPLE,
    defaultMessage: 'This is an example'
  }
}

const dummyComponent = ({ intl: { formatMessage } }) => (
  <input placeholder={formatMessage(messages.EXAMPLE)} />
)

export injectIntl(dummyComponent)
```

It is best to only use this method when `<FormattedMessage>` cannot be used
(i.e. when pure text is needed as opposed to a wrapped component)
