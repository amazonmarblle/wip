import { environment } from './../environments/environment';
import * as fromProduct from './product/reducers/product-reducer';
import { ProductState } from './product/reducers/product-state';
import * as fromUser from './user/reducers/user.reducer';
import * as fromCheckout from './checkout/reducers/checkout.reducer';
import * as fromAuth from './auth/reducers/auth.reducer';

import { combineReducers, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppState as State } from './interfaces';

import { compose } from '@ngrx/core/compose';

import { storeFreeze } from 'ngrx-store-freeze';

export const reducers: ActionReducerMap<State> = {
  products: fromProduct.reducer,
  auth: fromAuth.reducer,
  checkout: fromCheckout.reducer,
  users: fromUser.reducer
};

// console.log all actions - ToDo : Comment out these consoles before deploying the app.
export function logger(reducer: ActionReducer<State>): ActionReducer<any, any> {
  return function (state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : [];
