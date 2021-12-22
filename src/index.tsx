import React from 'react'
import { render } from 'react-dom'
import zoid from 'zoid'

import App from './app'

zoid.create({
  tag: 'airswap-otc-widget',
  url: document.location.href,
})

render(<App />, document.getElementById('root'))
