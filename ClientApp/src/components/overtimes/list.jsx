import React, { Component, Fragment } from 'react';
import { blink, errorHandler } from '../extra/extensions';
import { filter } from '../view/templates/index';
import { Overtime } from './Overtime';
import moment from 'moment';
import '../view/fixedTable.css';



export default class OvertimeList extends Component {
  displayName = OvertimeList.name;

  state = {
    overtimes: this.props.overtimes.filter(o => moment(o.date).year() === moment().year()),
    year: moment().year(),
    deptId: 0,
    officeId: 0,
    userId: 0
  }

  headManager = this.props.users.find(u => u.fullName === "Теличко Константин Сергеевич");



  ///// RENDER
  render() {
    const cDeptId = this.state.deptId;
    const cOfficeId = this.state.officeId;

    const offices = cDeptId
      ? this.props.offices.filter(o => o.deptId === cDeptId)
      : this.props.offices;

    let users = cDeptId
      ? [
        ...this.props.users.filter(u => this.props.offices.filter(o => o.deptId === cDeptId).some(of => u.officeId === of.id)),
        ...this.props.users.filter(us => us.deptId === cDeptId),
      ]
      : this.props.users;


    users = cOfficeId
      ? users.filter(u => u.officeId === cOfficeId)
      : users;

    users = cDeptId === 1
      ? [...users, this.headManager]
      : users;


    const filterProps = {
      users: users,
      offices: offices,
      depts: this.props.depts,
      years: [...new Set(this.props.overtimes.map(o => moment(o.date).year())).add(moment().year())],
      year: this.state.year,
      deptId: this.state.deptId,
      officeId: this.state.officeId,
      userId: this.state.userId,
      applyFilter: () => this.applyFilter(),
      reset: this.reset,
    }


    if (this.state.overtimes.length === 0)
      return filter(filterProps);

    let overtimes = this.state.overtimes.map(o =>
      <Overtime
        key={o.id}
        overtime={o}
        user={this.props.users.find(u => u.id === o.userId)}
        deleteClick={this.deleteClick}
      />);

    return (
      <Fragment>
        {filter(filterProps)}
        <table className='table table-sm table-hover mt-3 mytable-sm' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th width="30%">Работник</th>
              <th>Дата переработки</th>
              <th>Продолжительность</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{overtimes}</tbody>
        </table>
      </Fragment>
    );
  }


  applyFilter = () => {
    const year = +document.getElementById("year").value;
    const dept = this.props.depts.find(d => d.id === +document.getElementById("deptId").value);
    const office = this.props.offices.find(o => o.id === +document.getElementById("officeId").value);
    const user = this.props.users.find(u => u.id === +document.getElementById("userId").value);

    let users;
    let overtimes = this.props.overtimes;

    if (dept) {
      users = [...this.props.users.filter(u => u.deptId === dept.id)];

      let offices = this.props.offices.filter(o => o.deptId === dept.id);

      users = offices instanceof Array
        ? offices.length > 0
          ? [...users, ...this.props.users.filter(u => offices.some(of => u.officeId === of.id))]
          : [...users]

        : [...users, ...this.props.users.filter(u => u.officeId === offices.id)]

      if (dept.id === 1)
        users = [...users, this.headManager];
    }

    if (office) {
      users
        ? users = users.filter(u => u.officeId === office.id)
        : users = this.props.users.filter(u => u.officeId === office.id);
    }

    if (user) {
      users
        ? users = users.find(u => u.id === user.id)
        : users = this.props.users.find(u => u.id === user.id);
    }

    if (year !== 0)
      overtimes = this.props.overtimes.filter(v => moment(v.beginDate).year() === year)

    if (!users)
      users = this.props.users;

    this.setState({
      year: year,
      deptId: dept ? dept.id : 0,
      officeId: office ? office.id : 0,
      userId: user ? user.id : 0,
      overtimes: users instanceof Array
        ? overtimes.filter(v => users.some(u => u.id === v.userId))
        : overtimes.filter(v => v.userId === users.id)
    });
  }

  reset = () => this.setState({
    overtimes: this.props.overtimes.filter(v => moment(v.beginDate).year() === moment().year()),
    year: moment().year(),
    deptId: null,
    officeId: null,
    userId: null
  })



  deleteClick = async id => {
    const response = await fetch(`api/overtime/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      blink(`Переработка успешно удалена`);
      this.props.deleteOvertime(id);
      this.setState({ overtimes: this.props.overtimes });
    }
    else
      response.json()
        .then(error => blink(errorHandler(error), true));
  }

}