/**
 *  @fileoverview This file exports the redux store that contains the global state of
 *  our application.
 */
import { createStore } from 'redux';
import { reducer } from './reducer.js';

export const store = createStore(reducer);
