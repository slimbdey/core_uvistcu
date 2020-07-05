import React, { Component } from 'react';
import { blink, errorHandler } from '../extra/extensions';
import { Route } from 'react-router-dom';
import { InputGroup, OptionsInputGroup } from '../view/templates';


export default class OfficeAlter extends Component {
  displayName = OfficeAlter.name;

  state = {
    officePlangton: this.props.users.filter(of => of.officeId === this.props.office.id)
  }

  /////// RENDER
  render() {
    let usrOptions = this.props.users.map(user => <option key={user.id} value={user.id}> {user.fullName}</option>);

    let ofcUsers = this.state.officePlangton.map(u =>
      <li className="list-group-item" key={u.id}>
        {u.fullName}
        <a href="/user" className="float-right" onClick={(e) => { e.preventDefault(); this.appendRemoveClick(u.id, false); }}>Удалить</a>
      </li>);

    return (
      <div>
        <form name="alterForm" className="d-flex flex-column">
          <button type="submit" disabled style={{ display: 'none' }} ></button>
          <div className="d-flex flex-row col-md-12 pl-0">

            <div className="col-md-5 pl-0">
              <InputGroup name="name" value={this.props.office.name} hint="Наименование бюро" reversed />
              <OptionsInputGroup reversed
                name="chiefId"
                id="chiefId"
                defaultValue={this.props.office.chiefId}
                options={usrOptions}
                hint="Руководитель бюро"
              />

              <div className="input-group form-group">
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

            <div className="mr-5">&nbsp;</div>

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
            <Route render={({ history }) => (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  history.push('/office');
                  this.props.alterClick();
                }}
              >
                Изменить
              </button>
            )} />
          </div>
        </form >
      </div >
    );
  }


  appendRemoveClick = async (userId, append = true) => {
    let user = this.props.users.find(u => u.id === +userId);

    let alreadyThere = this.state.officePlangton.includes(user);
    if ((alreadyThere && append) || (!alreadyThere && !append))
      return;

    append
      ? user.officeId = +this.props.office.id
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
        ? [...this.state.officePlangton, user]
        : this.state.officePlangton.filter(u => u.id !== +userId);

      this.setState({ officePlangton: newUserSet });
    }
    else {
      response.json()
        .then(error => blink(errorHandler(error), true));
    }
  }

}