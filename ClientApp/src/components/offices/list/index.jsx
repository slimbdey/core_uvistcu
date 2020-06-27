import React, { Component } from 'react';
import Modal from '../../extra/modal';



export class OfficeList extends Component {

  ///// RENDER
  render() {
    if (this.props.offices.length === 0)
      return <div></div>;

    return (
      <div>
        <table className='table table-sm table-hover mt-3' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Наименование</th>
              <th width="35%">Руководитель</th>
              <th>Сотрудники</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.offices.map(office => {
              let userName = this.props.users.length > 0 && this.props.users.find(u => u.id === +office.chiefId).fullName;
              return <tr key={office.id}>
                <td>{office.name}</td>
                <td>{userName}</td>
                <td></td>
                <td className="d-flex">
                  <a href="/management" onClick={this.props.detailsClick}>Подробно</a>&nbsp;&nbsp;
                  <Modal
                    buttonLabel="Удалить"
                    text={`Вы действительно хотите удалить бюро ${office.name}?`}
                    func={() => this.deleteClick(office.id, office.name)} />
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
      this.props.blink(`Бюро ${name} успешно удалено`);
      this.props.deleteOffice(id);
    }
    else
      this.props.blink(response.statusText, true);
  }

}