import React, { Component } from 'react';
import Modal from '../extra/modal';
import { blink } from '../extra/extensions';


export default class OfficeList extends Component {
  displayName = OfficeList.name;

  ///// RENDER
  render() {
    if (this.props.offices.length === 0)
      return <div></div>;

    return (
      <div>
        <table className='table table-sm table-hover mt-3' aria-labelledby="tabelLabel">
          <thead className="thead-light">
            <tr>
              <th>Наименование</th>
              <th width="35%">Руководитель</th>
              <th>Работники</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.offices.map(office => {
              let manager = this.props.users.find(u => u.id === +office.chiefId);
              let users = this.props.users.filter(u => u.officeId === +office.id).map(us => <div key={us.id}>{us.fullName}</div>);
              return <tr key={office.id}>
                <td>{office.name}</td>
                <td>{manager.fullName}</td>
                <td>{users}</td>
                <td>
                  <div className="d-flex">
                    <a href="/office" onClick={(e) => { e.preventDefault(); this.props.alterClick(office.id); }}>Изменить</a>&nbsp;&nbsp;
                    <Modal
                      buttonLabel="Удалить"
                      text={`Вы действительно хотите удалить бюро ${office.name}?`}
                      func={() => this.deleteClick(office.id, office.name)} />
                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    );
  }


  deleteClick = async (id, name) => {
    const response = await fetch(`api/office/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      blink(`Бюро ${name} успешно удалено`);
      this.props.deleteOffice(id);
    }
    else
      this.props.blink(await response.json(), true);
  }

}