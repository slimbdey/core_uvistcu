import React, { Component } from 'react';


export class OfficeCreate extends Component {
  displayName = OfficeCreate.name;

  state = {
    office: this.props.state.offices.find(o => o.id === this.props.officeId),
    users: this.props.state.users.filter(u => u.officeId === this.props.officeId)
  }

  /////// RENDER
  render() {//TODO:::::::::::::::
    let usrOptions = this.props.state.users.map(user => <option key={user.id} value={user.id}> {user.fullName}</option>);
    let ofcOptions = this.props.state.offices.map(office => <option key={office.id} value={office.id}>{office.name}</option>);

    let offices = this.state.offices.map(o => <li className="list-group-item" key={o.id}>
      {o.name}
      <a href="/office" className="float-right" onClick={(e) => { e.preventDefault(); this.appendRemoveClick(o.id, false); }}>Удалить</a>
    </li>);

    return (
      <div>
        <form name="alterForm" className="d-flex flex-column">
          <div className="d-flex flex-row col-md-12 pl-0">

            <div className="col-md-4 pl-0">
              <div className="form-group">
                <button type="submit" disabled style={{ display: 'none' }} ></button>
                <label htmlFor="name" className="text-muted">Наименование отдела:</label>
                <input className="form-control" name="name" defaultValue={this.state.dept.name} />
              </div>

              <div className="form-group">
                <label htmlFor="managerId" className="text-muted">Руководитель отдела:</label>
                <div className="input-group">
                  <select
                    className="custom-select"
                    name="managerId"
                    id="managerId"
                    defaultValue={this.state.dept.managerId}
                  >{usrOptions}</select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="add" className="text-muted">Добавить бюро:</label>
                <div className="input-group">
                  <select className="custom-select" id="newOffice" name="add">{ofcOptions}</select>
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => this.appendRemoveClick(document.getElementById("newOffice").value)}
                    >Добавить</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-1">&nbsp;</div>

            <div className="col-md-7">
              <div className="form-group">
                <div className="card">
                  <div className="card-header text-muted">Бюро в отделе:</div>
                  <ul className="list-group list-group-flush">{offices.length > 0 ? offices : <li className="list-group-item">Нет бюро</li>}</ul>
                </div>
              </div>
            </div>

          </div>

          <div className="mb-4 col-md-3 pl-0"><br /><hr />
            <button type="button" className="btn btn-outline-primary" onClick={this.props.alterClick}>Изменить</button>
          </div>
        </form >
      </div>
    );
  }

}