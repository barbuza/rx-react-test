import { lightcoral, lightgreen } from "csx";
import * as React from "react";
import { connect, Omit } from "react-redux";
import { Dispatch } from "redux";
import { style } from "typestyle";
import { CSSProperties } from "typestyle/lib/types";

import { createAddUserAction, createRemoveUserAction, createSetLimitAction, createToggleOnlineAction } from "./actions";
import { randomAge, randomName } from "./random";
import { IReduxState } from "./reducer";
import { IUser } from "./streams/users";

interface IUserProps {
  removing: boolean;
}

interface IUserDispatch {
  removeUser: typeof createRemoveUserAction;
}

function mapUsersProps(state: IReduxState, user: IUser): IUserProps {
  return {
    removing: state.removing.indexOf(user.id) !== -1,
  };
}

function mapUserDispatch(dispatch: Dispatch<IReduxState>): IUserDispatch {
  return {
    removeUser: (id: string) => dispatch(createRemoveUserAction(id)),
  };
}

const onlineStyle = style({
  backgroundColor: lightgreen.toString(),
});

const offlineStyle = style({
  backgroundColor: lightcoral.toString(),
});

class UserComponent extends React.PureComponent<IUser & IUserDispatch & IUserProps, object> {
  public render() {
    const { id, name, age, online, removing } = this.props;
    return (
      <tr className={online ? onlineStyle : offlineStyle}>
        <td>{id}</td>
        <td>{name}</td>
        <td>{age}</td>
        <td>
          <button onClick={this.remove} disabled={removing}>
            remove
          </button>
        </td>
      </tr>
    );
  }

  protected remove = () => {
    this.props.removeUser(this.props.id);
  };
}

const User = connect(mapUsersProps, mapUserDispatch)(UserComponent);

interface IAppDispatch {
  setLimit: typeof createSetLimitAction;
  toggleOnline: typeof createToggleOnlineAction;
  addUser: typeof createAddUserAction;
  removeUser: typeof createRemoveUserAction;
}

function mapProps(state: IReduxState): IReduxState {
  return state;
}

function mapDispatch(dispatch: Dispatch<IReduxState>): IAppDispatch {
  return {
    setLimit: (limit: number) => dispatch(createSetLimitAction(limit)),
    toggleOnline: () => dispatch(createToggleOnlineAction()),
    addUser: (user: Omit<IUser, "id" | "online">) => dispatch(createAddUserAction(user)),
    removeUser: (id: string) => dispatch(createRemoveUserAction(id)),
  };
}

const cellStyle: CSSProperties = {
  textAlign: "left",
  border: "1px solid black",
  padding: "2px 8px",
};

const userListStyle = style({
  borderCollapse: "collapse",
  $nest: {
    th: cellStyle,
    td: cellStyle,
  },
});

class AppComponent extends React.Component<IReduxState & IAppDispatch, object> {
  public render() {
    const { limit, onlineOnly, users, loading, toggleOnline, adding } = this.props;

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
              <th>id</th>
              <th>name</th>
              <th>age</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>{users.slice(0, limit).map(user => <User key={user.id} {...user} />)}</tbody>
        </table>
        <div>
          <button disabled={!!adding} onClick={this.addUser}>
            add user
          </button>
          <button disabled={!!adding} onClick={this.add20Users}>
            add 20 users
          </button>
          <button disabled={users.length === 0} onClick={this.removeVisible}>
            remove visible
          </button>
        </div>
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
