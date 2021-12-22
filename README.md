# AirSwap OTC

## Getting started

This repository uses .nvmrc to manage node version, so run `nvm install` before `yarn` to make sure you are running the correct node version.

## Important Notes

- `.babelrc` is used for `extract-react-intl-messages` only. The dev webpack
  babel config is loaded inside `config-overrides`, and the storybook babel
  config is loaded inside `.storybook/webpack.config.js`
- We're currently injecting extra babel plugins inside the react-scripts webpack
  configs instead of using babelrc to preserve the react-scripts additions
