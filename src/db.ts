import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

import { DataSnapshot, FirebaseDatabase, Query, Reference } from "@firebase/database-types";

export class ObservableDb {
  protected readonly db: FirebaseDatabase;

  constructor(db: FirebaseDatabase) {
    this.db = db;
  }

  public ref(path: string): ObservableRef {
    return new ObservableRef(this.db.ref(path));
  }
}

const withDefaults = <T extends { [key: string]: any }>(defaultValue: T) => (value: any): T => {
  if (typeof value !== "object" || value === null) {
    return defaultValue;
  }
  const result: T = {} as any;
  for (const key of Object.keys(defaultValue)) {
    result[key] = typeof defaultValue[key] === typeof value[key] ? value[key] : defaultValue[key];
  }
  return result;
};

export class ObservableQuery {
  protected readonly query: Query;

  constructor(query: Query) {
    this.query = query;
  }

  public limitToFirst(limit: number): ObservableQuery {
    return new ObservableQuery(this.query.limitToFirst(limit));
  }

  public limitToLast(limit: number): ObservableQuery {
    return new ObservableQuery(this.query.limitToLast(limit));
  }

  public orderByChild(path: string): ObservableQuery {
    return new ObservableQuery(this.query.orderByChild(path));
  }

  public orderByKey(): ObservableQuery {
    return new ObservableQuery(this.query.orderByKey());
  }

  public orderByPriority(): ObservableQuery {
    return new ObservableQuery(this.query.orderByPriority());
  }

  public orderByValue(): ObservableQuery {
    return new ObservableQuery(this.query.orderByValue());
  }

  public keyList(): Observable<string[]> {
    return this.query$.map(snapshot => {
      const result: string[] = [];
      snapshot.forEach(item => {
        if (item.key) {
          result.push(item.key);
        }
        return false;
      });
      return result;
    });
  }

  public boolean(): Observable<boolean> {
    return this.query$.map(x => !!x.val());
  }

  public unsafeCast<T>(): Observable<T> {
    return this.query$.map(x => x.val());
  }

  public cast<T extends { [key: string]: any }>(orElse: T): Observable<T> {
    return this.query$.map(x => x.val()).map(withDefaults(orElse));
  }

  public number<T>(orElse: T): Observable<number | T> {
    return this.query$.map(x => {
      const val = x.val();
      if (typeof val === "number") {
        return val;
      }
      if (typeof val === "string") {
        return parseInt(val, 10);
      }
      return orElse;
    });
  }

  public string<T>(orElse: T): Observable<string | T> {
    return this.query$.map(x => {
      const val = x.val();
      if (typeof val === "string") {
        return val;
      }
      if (typeof val === "number") {
        return val.toString(10);
      }
      return orElse;
    });
  }

  protected get query$(): Observable<DataSnapshot> {
    return new Observable(f => {
      const fn = (snapshot: DataSnapshot | null) => {
        if (snapshot) {
          f.next(snapshot);
        }
      };
      this.query.on("value", fn);
      return () => {
        setTimeout(() => {
          this.query.off("value", fn);
        });
      };
    });
  }
}

export class ObservableRef extends ObservableQuery {
  protected readonly ref: Reference;

  constructor(ref: Reference) {
    super(ref);
    this.ref = ref;
  }

  public child(path: string): ObservableRef {
    return new ObservableRef(this.ref.child(path));
  }
}
