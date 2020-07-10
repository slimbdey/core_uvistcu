import React, { PureComponent } from 'react';
import { correctDate, datesDiff } from '../extra/extensions';
import { Link } from 'react-router-dom';
import Modal from '../view/templates';


export class Vacation extends PureComponent {
  displayName = Vacation.name;

  //////// RENDER
  render() {

    return (
      <tr>
        <td width="30%"><Link to={`/user/${this.props.user.id}`}>{this.props.user.fullName}</Link></td>
        <td>{correctDate(this.props.vacation.beginDate)}</td>
        <td>{correctDate(this.props.vacation.endDate)}</td>
        <td>{datesDiff(this.props.vacation.beginDate, this.props.vacation.endDate)}</td>
        <td className="d-flex flex-row">
          <Link to={`/vacation/${this.props.vacation.id}`}>Изменить</Link>&nbsp;&nbsp;&nbsp;
              <Modal
            buttonLabel="Удалить"
            text="Вы действительно хотите удалить отпуск?"
            func={() => this.props.deleteClick(this.props.vacation.id)} />
        </td>
      </tr>
    );
  }
}