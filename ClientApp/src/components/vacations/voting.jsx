import React, { Component, Fragment } from 'react';
import { datesDiff, keyGen, round } from '../extra/extensions';
import moment from 'moment';

import '../view/fixedTable.css';



const row = (userVacation) => {
  const fullName = userVacation.fullName;
  const rating = userVacation.rating;
  let summ = 0;
  for (let key in userVacation)
    if (!isNaN(key))
      summ += userVacation[key];

  let result = [];
  for (let i = 1; i < 13; ++i)
    result.push(<td key={keyGen()} style={{ border: "1px solid whitesmoke" }}>{userVacation[i] || " "}</td>);

  return <tr className="text-center" key={keyGen()}>
    <td width="3%" style={{ border: "1px solid whitesmoke", borderLeft: "none" }} className="text-muted">{round(rating)}</td>
    <td width="30%" style={{ border: "1px solid whitesmoke", background: "rgba(245,245,245,.4)" }} className="text-left">{fullName}</td>
    {[...result]}
    <td style={{ border: "1px solid whitesmoke", background: "rgba(240,247,222,.4)" }}>{summ}</td>
  </tr>;
}



export default class VacationVoting extends Component {


  /////// RENDER
  render() {
    let deptPeople = [];
    deptPeople.push(...this.props.users.filter(u => u.deptId === this.props.deptId));

    const deptOffices = this.props.offices.filter(o => o.deptId === this.props.deptId);
    if (deptOffices.length > 0)
      deptPeople.push(...this.props.users.filter(u => deptOffices.some(o => u.officeId === o.id)));

    const headManager = this.props.users.find(u => u.fullName === "Теличко Константин Сергеевич");
    if (this.props.deptId === 1)
      deptPeople = [...deptPeople, headManager];

    let userVacations = {};
    const vacations = this.props.vacations.slice().filter(v => deptPeople.some(u => u.id === v.userId));
    vacations.forEach(v => {
      if (!userVacations[v.userId]) {
        userVacations[v.userId] = {};
        const user = deptPeople.find(u => u.id === v.userId);
        userVacations[v.userId].fullName = user.fullName;
        userVacations[v.userId].rating = user.vacationRating;
      }

      let dur = datesDiff(v.beginDate, v.endDate) + 1;
      let month = +moment(v.beginDate).month() + 1;

      if (!userVacations[v.userId][month])
        userVacations[v.userId][month] = dur;

      else userVacations[v.userId][month] += dur;
    });


    let userRating = [];
    for (let key in userVacations)
      userRating.push({ id: key, rating: userVacations[key].rating });

    let sortedRating = userRating.sort((a, b) => a.rating - b.rating);
    let counter = 1;
    sortedRating.forEach(s => userVacations[s.id].rating = counter++);

    let content = [];
    for (let userId in userVacations)
      content.push(row(userVacations[userId]));


    return (
      <Fragment>
        <table className='table table-sm mytable2' aria-labelledby="tabelLabel">
          <thead>
            <tr className="text-center">
              <th width="3%">R</th>
              <th width="30%" className="text-right pr-4">Месяц:</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10</th>
              <th>11</th>
              <th>12</th>
              <th>Σ</th>
              <th width="1.5%"></th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </Fragment >
    );
  }
}