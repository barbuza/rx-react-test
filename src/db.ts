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
    return this.query$.map((snapshot) => {
      const result: string[] = [];
      snapshot.forEach((item) => {
        if (item.key) {
          result.push(item.key);
        }
        return false;
      });
      return result;
    });
  }

  public boolean(): Observable<boolean> {
    return this.query$.map((x) => !!x.val());
  }

  public cast<T>(): Observable<T> {
    return this.query$.map((x) => x.val());
  }

  protected get query$(): Observable<DataSnapshot> {
    return Observable.create((f: any) => {
      const fn = (snapshot: DataSnapshot | null) => {
        if (snapshot) {
          f.next(snapshot);
        }
      };
      this.query.on("value", fn);
      return () => {
        setTimeout(() => {
          this.query.off("value", fn);
        }, 0);
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
