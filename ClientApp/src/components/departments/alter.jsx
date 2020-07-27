import React, { Component } from 'react';
import { blink, errorHandler } from '../extra/extensions';
import { Route } from 'react-router-dom';
import { InputGroup, OptionsInputGroup } from '../view/templates';


export default class DepartmentAlter extends Component {
  displayName = DepartmentAlter.name;


  state = {
    deptOffices: this.props.offices.filter(of => of.deptId === this.props.dept.id),
    deptPeople: this.props.users.filter(u => u.deptId === this.props.dept.id)
  }


  /////////// RENDER
  render() {
    let usrOptions = this.props.users.map(user => <option key={user.id} value={user.id}> {user.fullName}</option>);
    let ofcOptions = this.props.offices.map(office => <option key={office.id} value={office.id}>{office.name}</option>);

    const offices = this.state.deptOffices.map(o =>
      <li className="list-group-item" key={o.id}>
        {o.name}
        <a href="/office" className="float-right" onClick={e => this.appendRemoveClick(e, o.id, true, false)}>Удалить</a>
      </li>);

    const users = this.state.deptPeople.map(dp =>
      <li className="list-group-item" key={dp.id}>
        {dp.fullName}
        <a href="/user" className="float-right" onClick={e => this.appendRemoveClick(e, dp.id, false, false)}>Удалить</a>
      </li>);

    return (
      <div>
        <form name="alterForm" className="d-flex flex-column">
          <button type="submit" disabled style={{ display: 'none' }} ></button>
          <div className="d-flex flex-row col-md-12 pl-0">

            <div className="col-md-5 pl-0">
              <InputGroup name="name" value={this.props.dept.name} hint="Наименование" reversed />
              <OptionsInputGroup
                reversed
                name="managerId"
                id="managerId"
                value={this.props.dept.managerId}
                options={usrOptions}
                hint="Руководитель отдела"
              />

              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Группа</span>
                </div>
                <select className="custom-select" id="newOffice" name="add">{ofcOptions}</select>
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={e => this.appendRemoveClick(e, document.getElementById("newOffice").value)}
                  >Добавить</button>
                </div>
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Сотрудник</span>
                </div>
                <select className="custom-select" id="newEmployee" name="addEmployee">{usrOptions}</select>
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={e => this.appendRemoveClick(e, document.getElementById("newEmployee").value, false)}
                  >Добавить</button>
                </div>
              </div>

              <div className="mb-5 col-md-3 pl-0"><br /><hr />
                <Route render={({ history }) => (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      history.push('/department');
                      this.props.alterDept();
                    }}
                  >Изменить</button>
                )} />
              </div>
            </div>

            <div className="mr-5">&nbsp;</div>

            <div className="col-md-6">
              <div className="accordion" id="accordionExample">
                <div className="card">
                  <div className="card-header" id="headingOne">
                    <button
                      id="officesBtn"
                      className="btn btn-block p-0 text-left text-uppercase text-muted"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >группы отдела</button>
                  </div>
                  <div
                    id="collapseOne"
                    className="collapse show"
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample">
                    <div className="card-body p-0">
                      <ul className="list-group list-group-flush">{offices.length > 0 ? offices : <li className="list-group-item">Нет групп</li>}</ul>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header" id="headingTwo">
                    <button
                      id="slavesBtn"
                      className="btn btn-block p-0 text-left text-uppercase text-muted"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >работники отдела</button>
                  </div>
                  <div
                    id="collapseTwo"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionExample">
                    <div className="card-body p-0">
                      <ul className="list-group list-group-flush">{users.length > 0 ? users : <li className="list-group-item">Нет работников отдела</li>}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form >
      </div >
    );
  }


  appendRemoveClick = async (e, id, isOffice = true, append = true) => {
    e && e.preventDefault();

    const current = isOffice
      ? this.props.offices.find(o => o.id === +id)
      : this.props.users.find(u => u.id === +id)

    const alreadyThere = isOffice
      ? this.state.deptOffices.includes(current)
      : this.state.deptPeople.includes(current)

    if ((alreadyThere && append) || (!alreadyThere && !append))
      return;

    append
      ? current.deptId = +this.props.dept.id
      : current.deptId = +null;

    const api = isOffice
      ? "api/office"
      : "api/user"

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(current)
    });

    if (response.ok) {
      blink(`Штатная единица успешно ${append ? "добавлена" : "удалена"}`);

      const newSet = append
        ? isOffice
          ? [...this.state.deptOffices, current]
          : [...this.state.deptPeople, current]

        : isOffice
          ? this.state.deptOffices.filter(o => o.id !== id)
          : this.state.deptPeople.filter(u => u.id !== id)

      if (isOffice) {
        this.setState({ deptOffices: newSet })
        const collapseOne = document.getElementById("collapseOne")
        append && collapseOne.classList.length === 1 && document.getElementById("officesBtn").click();
      }
      else {
        this.setState({ deptPeople: newSet })
        const collapseTwo = document.getElementById("collapseTwo")
        append && collapseTwo.classList.length === 1 && document.getElementById("slavesBtn").click();
      }
    }
    else
      response.json()
        .then(error => blink(errorHandler(error), true));
  }

}
