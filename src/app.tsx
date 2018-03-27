import { action } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";

import * as styles from "./index.css";
import { users } from "./users";

@observer
class App extends React.Component<object, object> {

  public render() {

    return (
      <>
        limitToFirst
        &nbsp;
        <button onClick={this.less} disabled={users.limit === 1}>-</button>
        {users.limit}
        <button onClick={this.more} disabled={users.limit === 5}>+</button>
        &nbsp;
        onlineOnly
        <input type="checkbox" checked={users.onlineOnly} onChange={users.toggleOnlineOnly} />
        {users.isLoading && <>&nbsp;loading</>}
        {users.users.map((user) => (
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

  @action
  protected more = () => {
    if (users.limit < 5) {
      users.setLimit(users.limit + 1);
    }
  }

  protected less = () => {
    if (users.limit > 1) {
      users.setLimit(users.limit - 1);
    }
  }

}

render(<App />, document.getElementById("root"));
