import React, { Component } from 'react';
import { correctDate, blink, errorHandler } from '../extra/extensions';
import { DateGroup, OptionsInputGroup } from '../view/templates';
import '../view/fixedTable.css';
import { connect } from 'react-redux';


class LabourPriority extends Component {
  displayName = LabourPriority.name;



  ///// RENDER
  render() {
    if (this.props.labours.length === 0)
      return <div></div>;

    let labours = this.props.labours.slice().sort((a, b) => a.date > b.date);

    let userMap = new Map();
    labours.map(lab => Object.entries(lab))
      .map(ar => [ar[3][1], ar[1][1]])
      .map(ud => ud[0].map(id => userMap.set(id, ud[1])));

    this.props.users.map(u => !userMap.has(u.id) && u.participateInLabour && userMap.set(u.id, "2020-01-01T00:00:00"));

    let priority = Array.from(userMap.entries()).sort((a, b) => a[1] > b[1]);

    let counter = 0;
    let content = priority.map(userDate =>
      <tr key={userDate[0]}>
        <td width="5%">{++counter}</td>
        <td width="5%" style={{ background: "#ededed" }}>
          <input type="checkbox" name="Users" defaultValue={userDate[0]} />
        </td>
        <td width="20%">{correctDate(userDate[1])}</td>
        <td>{this.props.users.find(u => u.id === userDate[0]).fullName}</td>
      </tr>
    );

    let managers = this.props.users.map(user =>
      <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div className="d-flex flex-row justify-content-between">
        <table className='table table-sm table-hover mytable2 col-md-6 mt-3' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th width="5%"></th>
              <th width="5%"></th>
              <th width="20%">Дата</th>
              <th>Работник</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
        <div className="col-md-5">
          <div
            className="text-uppercase text-muted mt-0 mb-4"
            style={{ fontSize: "2.5rem", fontWeight: 300 }}
          >направить работать</div>
          <DateGroup name="Date" value={(new Date()).toISOString().slice(0, 10)} hint="Дата субботника" />
          <OptionsInputGroup reversed name="ManagerId" options={managers} hint="Кто назначил" />

          <div className="col-md-5 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={(e) => this.createLabour(e)}
            >Направить</button>
          </div>
        </div>
      </div>
    );
  }


  createLabour = (e) => {
    e && e.preventDefault();

    let nodes = document.getElementsByName("Users");
    let userIds = [];
    for (let node of nodes)
      node.checked && userIds.push(+node.value);

    if (userIds.length === 0) {
      blink("Выберите хотя бы одного работника", true);
      return;
    }

    let date = document.getElementsByName("Date")[0].value;
    let managerId = document.getElementsByName("ManagerId")[0].value;

    fetch("api/labour", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Date: date,
        ManagerId: +managerId,
        UserIds: userIds
      })
    })
      .then(response =>
        response.json()
          .then(data => {
            if (response.ok) {
              this.props.dispatch({
                type: "ADD_LABOUR",
                labour: { id: data, date: date, managerId: +managerId, userIds: userIds }
              });
              blink(`Субботник успешно добавлен`);
              this.props.appoint();
            }
            else
              blink(errorHandler(data), true);
          })
      );
  }

}


export default connect()(LabourPriority);