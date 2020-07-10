import React, { Component } from 'react';
import { blink, errorHandler } from '../extra/extensions';
import { Vacation } from './Vacation';




export default class VacationList extends Component {
  displayName = VacationList.name;


  ///// RENDER
  render() {
    if (this.props.vacations.length === 0)
      return <div>No vacations</div>;

    let vacations = this.props.vacations.map(v =>
      <Vacation
        key={v.id}
        vacation={v}
        user={this.props.users.find(u => u.id === v.userId)}
      />);

    return (
      <table className='table table-sm table-hover mt-3' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th width="30%">Сотрудник</th>
            <th>Начало</th>
            <th>Окончание</th>
            <th>Продолжительность</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{vacations}</tbody>
      </table>
    );
  }


  deleteClick = async (id) => {
    const response = await fetch(`api/department/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    response.ok
      ? this.props.deleteVacation(id)
        .catch(alert)
        .then(blink(`Отпуск успешно удален`))

      : response.json()
        .then(error => blink(errorHandler(error), true));
  }

}