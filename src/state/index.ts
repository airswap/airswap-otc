/* eslint-disable */
import { connectActionContainer } from 'airswap.js/src/utils/redux'
import _ from 'lodash'

import * as locale from './locale'
import * as orders from './orders'
import * as router from './router'
import { PRODUCTION_HOSTNAME } from '../constants'

const state = { locale, router, orders }

const middleware = _.filter(_.map(_.values(state), 'middleware'))
const rootReducerObj = _.pickBy(_.mapValues(state, 'reducers'), _.identity) // the _.pickBy(*, _.identity) removes falsy object values (for state modules without reducers)
const defaultState = _.pickBy(_.mapValues(state, 'defaultState'), _.identity)

const configureStateContainers = connect =>
  _.mapValues(_.merge({}, ..._.compact(_.map(_.values(state), 'containers'))), containerSelector =>
    containerSelector(connect),
  )

const configureActionContainers = connect =>
  _.mapValues(_.merge({}, ..._.compact(_.map(_.values(state), 'actions'))), (action, name) =>
    connectActionContainer(action, name)(connect),
  )

export { defaultState, middleware, rootReducerObj, configureStateContainers, configureActionContainers }
