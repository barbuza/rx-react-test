import * as React from "react";
import { connect, Omit } from "react-redux";
import { Dispatch } from "redux";
import { style } from "typestyle";

import {
  createAddUserAction,
  createRemoveUserAction,
  createSetLimitAction,
  createToggleOnlineAction,
} from "../actions";
import { randomAge, randomName } from "../random";
import { IReduxState } from "../reducer";
import { IUser } from "../streams/users";
import { User, userListCellStyle } from "./User";

interface IAppProps {
  loading: boolean;
  limit: number;
  onlineOnly: boolean;
  users: IUser[];
  removing: string[];
}

interface IAppDispatch {
  setLimit: typeof createSetLimitAction;
  toggleOnline: typeof createToggleOnlineAction;
  addUser: typeof createAddUserAction;
  removeUser: typeof createRemoveUserAction;
}

function mapProps(state: IReduxState): IAppProps {
  const { limit, loading, adding, removing, onlineOnly, users } = state;
  return {
    limit,
    onlineOnly,
    users,
    removing,
    loading: loading || !!adding || !!removing.length,
  };
}

function mapDispatch(dispatch: Dispatch<IReduxState>): IAppDispatch {
  return {
    setLimit: (limit: number) => dispatch(createSetLimitAction(limit)),
    toggleOnline: () => dispatch(createToggleOnlineAction()),
    addUser: (user: Omit<IUser, "id" | "online">) => dispatch(createAddUserAction(user)),
    removeUser: (id: string) => dispatch(createRemoveUserAction(id)),
  };
}

const userListStyle = style({
  borderCollapse: "collapse",
});

class AppComponent extends React.Component<IAppProps & IAppDispatch, object> {
  public render() {
    const { limit, onlineOnly, users, loading, toggleOnline } = this.props;

    return (
      <>
        limitToFirst &nbsp;
        <button onClick={this.less} disabled={limit === 1}>
          -
        </button>
        {limit}
        <button onClick={this.more} disabled={limit === 50}>
          +
        </button>
        &nbsp; onlineOnly
        <input type="checkbox" checked={onlineOnly} onChange={toggleOnline} />
        {loading && <>&nbsp;loading</>}
        <table className={userListStyle}>
          <thead>
            <tr>
              <th className={userListCellStyle}>id</th>
              <th className={userListCellStyle}>name</th>
              <th className={userListCellStyle}>age</th>
              <th className={userListCellStyle}>&nbsp;</th>
            </tr>
          </thead>
          <tbody>{users.slice(0, limit).map(user => <User key={user.id} {...user} />)}</tbody>
        </table>
        <button disabled={loading} onClick={this.addUser}>
          add user
        </button>
        <button disabled={loading} onClick={this.add20Users}>
          add 20 users
        </button>
        <button disabled={users.length === 0 || loading} onClick={this.removeVisible}>
          remove visible
        </button>
      </>
    );
  }

  protected more = () => {
    this.props.setLimit(this.props.limit + 1);
  };

  protected less = () => {
    this.props.setLimit(this.props.limit - 1);
  };

  protected add20Users = () => {
    for (let i = 0; i < 20; i++) {
      this.addUser();
    }
  };

  protected addUser = () => {
    this.props.addUser({
      name: randomName(),
      age: randomAge(),
    });
  };

  protected removeVisible = () => {
    const { users, removeUser, removing } = this.props;
    for (const user of users) {
      if (removing.indexOf(user.id) === -1) {
        removeUser(user.id);
      }
    }
  };
}

export const App = connect(mapProps, mapDispatch)(AppComponent);
