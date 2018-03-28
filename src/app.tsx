import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { createSetLimitAction, createToggleOnlineAction } from "./actions";
import * as styles from "./index.css";
import { IReduxState } from "./reducer";

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
        limitToFirst
        &nbsp;
        <button onClick={this.less} disabled={limit === 1}>-</button>
        {limit}
        <button onClick={this.more} disabled={limit === 5}>+</button>
        &nbsp;
        onlineOnly
        <input type="checkbox" checked={onlineOnly} onChange={toggleOnline} />
        {loading && <>&nbsp;loading</>}
        {users.map((user) => (
          <table key={user.id} className={styles.user + " " + (user.online ? styles.online : styles.offline)}>
            <tbody>
              <tr>
                <th>id</th>
                <td>{user.id}</td>
              </tr>
              <tr>
                <th>name</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>age</th>
                <td>{user.age}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </>
    );
  }

  protected more = () => {
    this.props.setLimit(this.props.limit + 1);
  }

  protected less = () => {
    this.props.setLimit(this.props.limit - 1);
  }

}

export const App = connect(mapProps, mapDispatch)(AppComponent);
