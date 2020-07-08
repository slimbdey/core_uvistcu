import React, { Component } from 'react';
import Modal from '../view/templates';
import { blink, errorHandler } from '../extra/extensions';
import { Link } from 'react-router-dom';


export default class DepartmentList extends Component {
  displayName = DepartmentList.name;


  ///// RENDER
  render() {
    if (this.props.depts.length === 0)
      return <div></div>;

    return (
      <div>
        <table className='table table-sm table-hover mt-3' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Наименование</th>
              <th width="35%">Руководитель</th>
              <th>Бюро</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.depts.map(dept => {
              let manager = this.props.users.find(u => u.id === +dept.managerId);
              let offices = this.props.offices.filter(o => o.deptId === +dept.id).map(os =>
                <div key={os.id}>
                  <Link to={`/office/${os.id}`} >{os.name}</Link>
                </div>);
              return <tr key={dept.id}>
                <td><Link to={`/department/${dept.id}`}>{dept.name}</Link></td>
                <td><Link to={`/user/${manager.id}`}>{manager.fullName}</Link></td>
                <td>{offices}</td>
                <td>
                  <div className="d-flex">
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