import React, { Component } from 'react';


export class DepartmentCreate extends Component {

  /////// RENDER
  render() {
    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div>
        <form name="CreateForm">
          <div className="form-group col-md-5 pl-0">
            <label htmlFor="Name">Наименование отдела:</label>
            <input className="form-control" name="Name" />
          </div>
          <div className="form-group col-md-5 pl-0">
            <label htmlFor="ChiefId">Руководитель отдела:</label>
            <select className="form-control" name="ChiefId">{options}</select>
          </div>
          <div className="mb-4">
            <button type="button" className="btn btn-outline-primary" onClick={this.props.addDept}>Создать</button>
          </div>
        </form >
      </div>
    );
  }

}