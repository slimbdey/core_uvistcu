import React, { PureComponent } from 'react';
import { correctDate } from "../extra/extensions";
import { Link } from 'react-router-dom';
import Modal from '../view/templates';


export class Labour extends PureComponent {
  labour = this.props.labour;
  manager = this.props.users.find(u => u.id === +this.labour.managerId);
  users = this.labour.userIds
    .map(uid =>
      <div key={uid}>
        <Link to={`/user/${uid}`} >{this.props.users.find(u => u.id === uid).fullName}</Link>
      </div>);

  render() {
    return (
      <tr>
        <td width="10%">{correctDate(this.labour.date)}</td>
        <td><Link to={`/user/${this.manager.id}`}>{this.manager.fullName}</Link></td>
        <td>{this.users}</td>
        <td width="15%">
          <div className="d-flex">
            <Link to={`/labour/${this.props.labour.id}`}>Изменить</Link>&nbsp;&nbsp;&nbsp;
              <Modal
              buttonLabel="Удалить"
              text="Вы действительно хотите удалить субботник?"
              func={() => this.props.deleteClick(this.labour.id)} />
          </div>
        </td>
      </tr>
    );
  }
}