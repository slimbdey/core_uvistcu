import React, { Component } from 'react';


export default class OfficeCreate extends Component {

  /////// RENDER
  render() {
    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div>
        <form name="CreateForm" >
          <div className="form-group col-md-5 pl-0">
            <button type="submit" disabled style={{ display: 'none' }} ></button>
            <label htmlFor="Name" className="text-muted">Наименование бюро:</label>
            <input className="form-control" name="Name" />
          </div>
          <div className="form-group col-md-5 pl-0">
            <label htmlFor="ChiefId" className="text-muted">Руководитель бюро:</label>

            <div className="input-group">
              <select className="custom-select" name="ChiefId">{options}</select>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={this.props.createOffice}
                >Создать</button>
              </div>
            </div>

          </div>
        </form >
      </div >
    );
  }

}