import React, { Component } from 'react';
import { blink, errorHandler } from '../extra/extensions';
import { Vacation } from './Vacation';
import { Loading } from '../view/templates';




export default class VacationList extends Component {
  displayName = VacationList.name;


  ///// RENDER
  render() {
    if (this.props.vacations.length === 0)
      return <Loading />;

    let vacations = this.props.vacations.map(v =>
      <Vacation
        key={v.id}
        vacation={v}
        user={this.props.users.find(u => u.id === v.userId)}
        deleteClick={this.deleteClick}
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
    fetch(`api/vacation/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
      .then(response =>
        response.ok
          ? blink(`Отпуск успешно удален`)
            .then(this.props.deleteVacation(id))

          : response.json()
            .then(data =>
              response.status === 404
                ? blink(data.title, true)
                : blink(errorHandler(data), true)
            )
      );
  }

}