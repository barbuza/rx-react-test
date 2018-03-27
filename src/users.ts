import * as baseDebug from "debug";
import { action, computed, observable, reaction } from "mobx";
import "rxjs/add/operator/observeOn";
import { Observable } from "rxjs/Observable";
import { animationFrame } from "rxjs/scheduler/animationFrame";
import { Subject } from "rxjs/Subject";

import { db$ } from "./firebase";

const debug = baseDebug("rx:users");

interface IUserData {
  name: string;
  age: number;
}

interface IUser extends IUserData {
  id: number;
  online: boolean;
}

class UserStore {

  @observable.ref
  public isLoading: boolean = true;

  @observable.ref
  public onlineOnly: boolean = false;

  @observable.ref
  public limit: number = 4;

  @observable.ref
  protected userList: IUser[] = [];

  @computed
  public get users(): IUser[] {
    return this.userList.slice(0, this.limit);
  }

  constructor() {
    const userLimit$: Subject<number> = new Subject();
    reaction(() => this.limit, (limit) => {
      userLimit$.next(limit);
    });

    const onlineOnly$: Subject<boolean> = new Subject();
    reaction(() => this.onlineOnly, (onlineOnly) => {
      onlineOnly$.next(onlineOnly);
    });

    const subscription = Observable.combineLatest(userLimit$, onlineOnly$)
      .switchMap(([limit, onlineOnly]) =>
        db$.ref(onlineOnly ? "online" : "users").orderByKey().limitToFirst(limit).keyList())
      .switchMap((userIds) => Observable.combineLatest(userIds.map(this.observableUser)))
      .observeOn(animationFrame)
      .subscribe(this.setUsers);

    if (module.hot) {
      module.hot.dispose(() => {
        debug("unsubscribe");
        subscription.unsubscribe();
      });
    }

    userLimit$.next(this.limit);
    onlineOnly$.next(this.onlineOnly);
  }

  @action
  public toggleOnlineOnly = () => {
    debug("toggle online");
    this.isLoading = true;
    this.onlineOnly = !this.onlineOnly;
  }

  @action
  public setLimit = (limit: number) => {
    debug("set limit");
    this.isLoading = true;
    this.limit = limit;
  }

  @action
  protected setUsers = (newUsers: IUser[]) => {
    debug("set users");
    this.isLoading = false;
    this.userList = newUsers;
  }

  protected observableUser = (uid: string): Observable<IUser> => {
    const userData$ = db$.ref("user").child(uid).cast<IUserData>();
    const online$ = db$.ref("online").child(uid).boolean();

    return Observable.combineLatest(
      userData$, online$,
      (userData, online) => ({ ...userData, online, id: parseInt(uid, 10) }),
    );
  }

}

export const users = new UserStore();
