import { black, border, lightcoral, lightgreen, params, px } from "csx";
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

export const userListCellStyle = style({
  textAlign: "left",
  border: border({
    style: "solid",
    color: black.toString(),
    width: px(1),
  }),
  padding: params(px(2), px(8)),
});

class UserComponent extends React.PureComponent<IUser & IUserDispatch & IUserProps, object> {
  public render() {
    const { id, name, age, online, removing } = this.props;
    return (
      <tr className={online ? onlineStyle : offlineStyle}>
        <td className={userListCellStyle}>{id}</td>
        <td className={userListCellStyle}>{name}</td>
        <td className={userListCellStyle}>{age}</td>
        <td className={userListCellStyle}>
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
