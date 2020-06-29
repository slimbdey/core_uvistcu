import React, { Component } from 'react';
import { blink, errorHandler } from '../extra/extensions';


export class OfficeAlter extends Component {
  displayName = OfficeAlter.name;

  state = {
    office: this.props.state.offices.find(o => o.id === this.props.officeId),
    users: this.props.state.users.filter(u => u.officeId === this.props.officeId)
  }

  /////// RENDER
  render() {
    let usrOptions = this.props.state.users.map(user => <option key={user.id} value={user.id}> {user.fullName}</option>);

    let ofcUsers = this.state.users.map(u => <li className="list-group-item" key={u.id}>
      {u.fullName}
      <a href="/user" className="float-right" onClick={(e) => { e.preventDefault(); this.appendRemoveClick(u.id, false); }}>Удалить</a>
    </li>);

    return (
      <div>
        <form name="alterForm" className="d-flex flex-column">
          <div className="d-flex flex-row col-md-12 pl-0">

            <div className="col-md-4 pl-0">
              <div className="form-group">
                <button type="submit" disabled style={{ display: 'none' }} ></button>
                <label htmlFor="name" className="text-muted">Наименование бюро:</label>
                <input className="form-control" name="name" defaultValue={this.state.office.name} />
              </div>

              <div className="form-group">
                <label htmlFor="chiefId" className="text-muted">Руководитель бюро:</label>
                <div className="input-group">
                  <select
                    className="custom-select"
                    name="chiefId"
                    id="chiefId"
                    defaultValue={this.state.office.chiefId}
                  >{usrOptions}</select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="add" className="text-muted">Добавить работника:</label>
                <div className="input-group">
                  <select className="custom-select" id="newUser" name="add">{usrOptions}</select>
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => this.appendRemoveClick(document.getElementById("newUser").value)}
                    >Добавить</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-1">&nbsp;</div>

            <div className="col-md-7">
              <div className="form-group">
                <div className="card">
                  <div className="card-header text-muted">Работники бюро:</div>
                  <ul className="list-group list-group-flush">{ofcUsers.length > 0 ? ofcUsers : <li className="list-group-item">Нет работников</li>}</ul>
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


  appendRemoveClick = async (userId, append = true) => {
    let user = this.props.state.users.find(u => u.id === +userId);

    let alreadyThere = this.state.users.includes(user);
    if ((alreadyThere && append) || (!alreadyThere && !append))
      return;

    append
      ? user.officeId = +this.props.officeId
      : user.officeId = null;

    const response = await fetch(`api/user`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: user.id,
        FullName: user.fullName,
        TabNum: user.tabNum,
        OfficeId: +user.officeId
      })
    });

    if (response.ok) {
      blink(`Работник ${user.fullName} успешно ${append ? "добавлен" : "удален"}`);

      let newUserSet = append
        ? [...this.state.users, user]
        : this.state.users.filter(u => u.id !== +userId);

      this.setState({ users: newUserSet });
    }
    else {
      let data = await response.json();
      blink(errorHandler(data), true);
    }
  }

}