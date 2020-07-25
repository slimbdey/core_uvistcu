import React, { PureComponent } from 'react';
import { correctDate } from '../extra/extensions';
import { Link } from 'react-router-dom';
import Modal from '../view/templates';


export class Overtime extends PureComponent {
  displayName = Overtime.name;

  trimMinutes = minutes => {
    let duration = "";

    let hours = ~~(minutes / 60);
    if (hours > 0) {
      duration += `${hours} ч. `;
      minutes -= hours * 60;
    }

    if (minutes > 0)
      duration += `${minutes} мин.`;

    return duration;
  }


  //////// RENDER
  render() {

    return (
      <tr>
        <td width="30%"><Link to={`/user/${this.props.user.id}`}>{this.props.user.fullName}</Link></td>
        <td>{correctDate(this.props.overtime.date)}</td>
        <td>{this.trimMinutes(this.props.overtime.minutes)}</td>
        <td>
          <div className="d-flex flex-row">
            <Link to={`/overtime/${this.props.overtime.id}`}>Изменить</Link>&nbsp;&nbsp;&nbsp;
                <Modal
              buttonLabel="Удалить"
              text="Вы действительно хотите удалить переработку?"
              func={() => this.props.deleteClick(this.props.overtime.id)} />
          </div>
        </td>
      </tr>
    );
  }
}