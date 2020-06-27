import React, { Component } from 'react';


export class OfficeCreate extends Component {

  /////// RENDER
  render() {
    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div>
        <form name="CreateForm" >
          <div className="form-group col-md-5 pl-0">
            <button type="submit" disabled style={{ display: 'none' }} ></button>
            <label htmlFor="Name">Наименование бюро:</label>
            <input className="form-control" name="Name" />
          </div>
          <div className="form-group col-md-5 pl-0">
            <label htmlFor="ChiefId">Руководитель бюро:</label>
            <select className="form-control" name="ChiefId">{options}</select>
          </div>
          <div className="mb-4">
            <button type="button" className="btn btn-outline-primary" onClick={this.props.addOffice}>Создать</button>
          </div>
        </form >
      </div >
    );
  }

}