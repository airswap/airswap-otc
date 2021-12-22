import React from 'react'
import { createGlobalStyle, ThemeProvider as BaseThemeProvider } from 'styled-components'
import reset from 'styled-reset'

import theme from '../../theme'

const BaseStyles = createGlobalStyle`
  ${reset}
  div {
    box-sizing: border-box;
  }
  #root {
    height: 100%;
    overflow-x: hidden;
  }
  html, body {
    cursor: default;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
  *,
  div,
  span,
  p,
  a {
    font-family: proxima-nova, sans-serif;
    letter-spacing: 0.5px;

    ::selection {
        background: #2b71ff; /*AirSwap Blue*/
      }

    ::-moz-selection {
        background: #2b71ff; /*AirSwap Blue*/
      }
  }
  body {
    margin: 0;
    padding: 0;
  }
  .token-selector-list {
    padding-bottom: 20px;
  }
  .wallet-carousel {
    height: 100%;

    .slick-list,
    .slick-track {
      height: 100%;
    }

    .slick-slide > div {
      height: 100%;
    }
  }
  .slick-next,
  .slick-prev {
    &::before {
      content: none !important;
    }
  }
  .airswap-spinner {
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 5px solid #2B71FF80;
    border-radius: 50%;
    border-top-color: #2B71FF;
    animation: spin 1.1s ease-in-out infinite;
    -webkit-animation: spin 1.1s ease-in-out infinite;
  }
  @keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`

theme.palette.borderColor = '#E5E5E5'

const Theme = Component => props => (
  <BaseThemeProvider theme={theme}>
    <>
      <Component {...props} />
      <BaseStyles />
    </>
  </BaseThemeProvider>
)

export default Theme
