import { Action, applyMiddleware, Dispatch, Reducer, Store, StoreEnhancerStoreCreator } from "redux";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { disposeReactor } from "./disposeReactor";

// tslint:disable-next-line:no-var-requires
const debug = require("debug")("rx:reactor");

export interface IReactorStore<S> extends Store<S> {
  [disposeReactor](): void;
}

export type ReactorStoreCreator<S> = (reducer: Reducer<S>, preloadedState?: S) => IReactorStore<S>;

export type ReactorStoreEnhancer<S> = (next: StoreEnhancerStoreCreator<S>) => ReactorStoreCreator<S>;

export interface IStreamApi<S> {
  action$: Observable<Action>;
  state$: BehaviorSubject<S>;
  dispatch: Dispatch<S>;
}

export type StreamCreator<S> = (api: IStreamApi<S>) => Subscription;

export function isReactorStore<S>(store: Store<S>): store is IReactorStore<S> {
  return disposeReactor in store;
}

const actionStreamMiddleware = (action$: Subject<Action>) => () => <S>(next: Dispatch<S>) => (action: any) => {
  const result = next(action);
  if (typeof action.type === "string") {
    action$.next(action);
  }
  return result;
};

export function createReactor<S>(...streamCreators: Array<StreamCreator<S>>): ReactorStoreEnhancer<S> {
  return (next: StoreEnhancerStoreCreator<S>): ReactorStoreCreator<S> => {
    return (reducer: Reducer<S>, preloadedState?: S) => {
      const action$ = new Subject<Action>();

      const store = applyMiddleware(actionStreamMiddleware(action$))(next)(reducer, preloadedState);

      const state$ = new BehaviorSubject(store.getState());
      store.subscribe(() => {
        state$.next(store.getState());
      });

      const api: IStreamApi<S> = {
        action$,
        state$,
        dispatch: store.dispatch,
      };

      const subs: Array<{ sub: Subscription; fn: any }> = [];
      for (const createStream of streamCreators) {
        debug("start %s", (createStream as any).name);
        subs.push({
          sub: createStream(api),
          fn: createStream,
        });
      }
      function dispose() {
        for (const sub of subs) {
          debug("dispose %s", sub.fn.name);
          sub.sub.unsubscribe();
        }
        if (isReactorStore(store)) {
          store[disposeReactor]();
        }
      }
      return { ...store, [disposeReactor]: dispose };
    };
  };
}
