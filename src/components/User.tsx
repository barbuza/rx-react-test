import { lightcoral, lightgreen } from "csx";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { style } from "typestyle";

import { createRemoveUserAction } from "../actions";
import { IReduxState } from "../reducer";
import { IUser } from "../streams/users";

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

export const User = connect(mapUsersProps, mapUserDispatch)(UserComponent);
