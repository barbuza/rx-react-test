import { Action, Reducer, Store, StoreEnhancerStoreCreator } from "redux";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

// tslint:disable-next-line:no-var-requires
const debug = require("debug")("rx:reactor");

type StreamCreator<S> = (state$: Observable<S>) => Observable<Action>;

export interface IReactorStore<S> extends Store<S> {
  dispose(): void;
}

export type ReactorStoreCreator<S> = (reducer: Reducer<S>, preloadedState?: S) => IReactorStore<S>;

export type ReactorStoreEnhancer<S> = (next: StoreEnhancerStoreCreator<S>) => ReactorStoreCreator<S>;

export function createStateReactor<S>(...streamCreators: Array<StreamCreator<S>>): ReactorStoreEnhancer<S> {
  return (next: StoreEnhancerStoreCreator<S>): ReactorStoreCreator<S> => {
    return (reducer: Reducer<S>, preloadedState?: S) => {
      const store = next(reducer, preloadedState);
      const state$ = new BehaviorSubject(store.getState());
      store.subscribe(() => {
        state$.next(store.getState());
      });
      const subs: Array<{ sub: Subscription; fn: any }> = [];
      for (const createStream of streamCreators) {
        subs.push({
          sub: createStream(state$).subscribe(store.dispatch),
          fn: createStream,
        });
      }
      function dispose() {
        for (const sub of subs) {
          debug("dispose %s", sub.fn.name);
          sub.sub.unsubscribe();
        }
      }
      return { ...store, dispose };
    };
  };
}
