import React, { Component } from 'react';
import { OptionsInputGroup, DateGroup } from '../view/templates';
import { datesDiff, blink } from '../extra/extensions';
import history from '../extra/history';


export default class VacationAlter extends Component {

  componentDidMount = () => this.props.vacation.id && this.onChange();

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
    if (!this.props.vacation.id)
      return <div className="text-danger font-italic">Нет такого отпуска</div>;

    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0">
            <OptionsInputGroup
              reversed hint="Работник" name="userId"
              options={options} value={this.props.vacation.userId}
            />
            <DateGroup
              name="beginDate" hint="Дата начала"
              onChange={this.onChange} value={this.props.vacation.beginDate}
            />
            <DateGroup
              name="endDate" hint="Дата окончания"
              onChange={this.onChange} value={this.props.vacation.endDate}
            />
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              id="bCreate"
              onClick={() => {
                this.props.alterVacation()
                  .catch(error => blink(error, true))
                  .then(success => success && history.push("/vacation"))
              }}
            >Изменить<span id="days" className="badge badge-light ml-2">0 дней</span>
            </button>
          </div>
        </form >
      </div >
    );
  }

}
