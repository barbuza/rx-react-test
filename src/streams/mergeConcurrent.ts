import { UnaryFunction } from "rxjs/interfaces";
import { Observable, ObservableInput } from "rxjs/Observable";
import { mergeMap } from "rxjs/operators/mergeMap";

export function mergeConcurrent<T, R>(
  concurrency: number,
  project: (value: T, index: number) => ObservableInput<R>,
): UnaryFunction<Observable<T>, Observable<R>> {
  return mergeMap<T, R, R>(project, (_, x: R) => x, concurrency);
}
