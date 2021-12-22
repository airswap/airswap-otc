import configureStore from 'airswap.js/src/redux/configureStore'
import { configureActionContainers, configureStateContainers } from 'airswap.js/src/redux/state'
import _ from 'lodash'
import React from 'react'
import { connect, Provider } from 'react-redux'

import {
  configureActionContainers as configureProjectActionContainers,
  configureStateContainers as configureProjectStateContainers,
  defaultState,
  middleware,
  rootReducerObj,
} from '../../state'

const persistedState = ['orders']
const store = configureStore(middleware, rootReducerObj, defaultState, persistedState)

// WHEN IN DEVELOPMENT, WE CAN SPECIFY A RINKEBY PRIVATE KEY FOR FASTER ITERATION
// store.dispatch(initPrivateKeySigner())

export const stateContainers = _.merge({}, configureStateContainers(connect), configureProjectStateContainers(connect))
export const actionContainers = _.merge(
  {},
  configureActionContainers(connect),
  configureProjectActionContainers(connect),
)

const Redux = Component => props => (
  <Provider store={store}>
    <Component {...props} />
  </Provider>
)

export { store }

export default Redux
