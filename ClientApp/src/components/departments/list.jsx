import React, { Component } from 'react';
import Modal from '../extra/modal';
import { blink, errorHandler, log } from '../extra/extensions';



export default class DepartmentList extends Component {
  displayName = DepartmentList.name;


  ///// RENDER
  render() {
    if (this.props.depts.length === 0)
      return <div></div>;

    return (
      <div>
        <table className='table table-sm table-hover mt-3' aria-labelledby="tabelLabel">
          <thead className="thead-light">
            <tr>
              <th>Наименование</th>
              <th width="35%">Руководитель</th>
              <th>Бюро</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.depts.map(dept => {
              let manager = this.props.users.length > 0 && this.props.users.find(u => u.id === +dept.managerId);
              let offices = this.props.offices.filter(o => o.deptId === +dept.id).map(os => <div key={os.id}>{os.name}</div>);
              return <tr key={dept.id}>
                <td>{dept.name}</td>
                <td>{manager.fullName}</td>
                <td>{offices}</td>
                <td>
                  <div className="d-flex">
                    <a href="/management" onClick={(e) => { e.preventDefault(); this.props.alterClick(dept.id); }}>Изменить</a>&nbsp;&nbsp;
                    <Modal
                      buttonLabel="Удалить"
                      text={`Вы действительно хотите удалить отдел ${dept.name}?`}
                      func={() => this.deleteClick(dept.id, dept.name)} />
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
    const response = await fetch(`api/department/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      blink(`Отдел ${name} успешно удален`);
      this.props.deleteDept(id);
    }
    else
      response.json()
        .then(error => blink(errorHandler(error), true));
  }

}