import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { createSetLimitAction, createToggleOnlineAction } from "./actions";
import * as styles from "./index.css";
import { IReduxState } from "./reducer";
import { IUser } from "./usersStream";

class User extends React.PureComponent<IUser, object> {
  public render() {
    const { id, name, age, online } = this.props;
    return (
      <tr className={online ? styles.online : styles.offline}>
        <td>{id}</td>
        <td>{name}</td>
        <td>{age}</td>
      </tr>
    );
  }
}

interface IAppActions {
  setLimit: typeof createSetLimitAction;
  toggleOnline: typeof createToggleOnlineAction;
}

function mapProps(state: IReduxState): IReduxState {
  return state;
}

function mapDispatch(dispatch: Dispatch<IReduxState>): IAppActions {
  return {
    setLimit: (limit: number) => dispatch(createSetLimitAction(limit)),
    toggleOnline: () => dispatch(createToggleOnlineAction()),
  };
}

class AppComponent extends React.Component<IReduxState & IAppActions, object> {
  public render() {
    const { limit, onlineOnly, users, loading, toggleOnline } = this.props;

    return (
      <>
        limitToFirst &nbsp;
        <button onClick={this.less} disabled={limit === 1}>
          -
        </button>
        {limit}
        <button onClick={this.more} disabled={limit === 5}>
          +
        </button>
        &nbsp; onlineOnly
        <input type="checkbox" checked={onlineOnly} onChange={toggleOnline} />
        {loading && <>&nbsp;loading</>}
        <table className={styles.userList}>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>age</th>
            </tr>
          </thead>
          <tbody>{users.map(user => <User key={user.id} {...user} />)}</tbody>
        </table>
      </>
    );
  }

  protected more = () => {
    this.props.setLimit(this.props.limit + 1);
  };

  protected less = () => {
    this.props.setLimit(this.props.limit - 1);
  };
}

export const App = connect(mapProps, mapDispatch)(AppComponent);
