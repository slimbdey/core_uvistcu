import React, { Component } from 'react';
import { OptionsInputGroup, DateGroup } from '../view/templates';
import { datesDiff } from '../extra/extensions';


export default class VacationCreate extends Component {

  componentDidMount = () => this.onChange();

  onChange = () => {
    let end = document.getElementsByName("endDate")[0].value;
    let begin = document.getElementsByName("beginDate")[0].value;
    let span = document.getElementById("days");
    let btn = document.getElementById("bCreate");

    let days = datesDiff(begin, end) + 1;
    if (!isNaN(days) && days > 0) {
      span.innerText = `${days} дней`;
      btn.disabled = false;
    }
    else {
      span.innerText = "0 дней";
      btn.disabled = true;
    }
  }

  /////// RENDER
  render() {
    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0">
            <OptionsInputGroup reversed hint="Работник" name="userId" options={options} />
            <DateGroup name="beginDate" hint="Дата начала" onChange={this.onChange} />
            <DateGroup name="endDate" hint="Дата окончания" onChange={this.onChange} />
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              id="bCreate"
              onClick={this.props.createVacation}
            >Создать<span id="days" className="badge badge-light ml-2">0 дней</span>
            </button>
          </div>
        </form >
      </div >
    );
  }

}

