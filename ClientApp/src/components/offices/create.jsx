import React, { Component } from 'react';


export default class OfficeCreate extends Component {

  /////// RENDER
  render() {
    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div className="mt-3">
        <form name="CreateForm" >
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0">
            <div className="input-group form-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Наименование</span>
              </div>
              <input className="form-control" name="Name" />
            </div>

            <div className="input-group form-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Руководитель</span>
              </div>
              <select className="custom-select" name="ChiefId">{options}</select>
            </div>
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.props.createOffice}
            >Создать</button>
          </div>
        </form >
      </div >
    );
  }

}