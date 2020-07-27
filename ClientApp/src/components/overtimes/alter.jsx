import React, { Component } from 'react';
import { DateGroup, OptionsInputGroup } from '../view/templates';
import moment from 'moment';


export default class OvertimeAlter extends Component {
  displayName = OvertimeAlter.name;

  options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option >);


  onChange = () => {
    let range = +document.getElementById("range").value;
    let date = document.getElementsByName("Date")[0].value;
    let span = document.getElementById("duration");
    let btn = document.getElementById("createBtn");

    if (moment(date).isValid() && range > 0) {
      let duration = "";

      let hours = ~~(range / 60);
      if (hours > 0) {
        duration += `${hours} ч. `;
        range -= hours * 60;
      }

      if (range > 0)
        duration += `${range} мин.`;

      span.innerText = duration;
      btn.disabled = false;
    }
    else {
      span.innerText = "0";
      btn.disabled = true;
    }
  }

  componentDidMount = () => this.onChange();


  /////////// RENDER
  render() {

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0" id="participants">
            <DateGroup name="Date" value={this.props.overtime.date.slice(0, 10)} hint="Дата переработки" />
            <OptionsInputGroup reversed name="UserId" options={this.options} hint="Сотрудник" value={this.props.overtime.userId} />
            <div className="form-group">
              <label htmlFor="range" className="text-muted">Продолжительность:</label>
              <input
                type="range"
                className="form-control-range"
                id="range"
                name="Range"
                min="0"
                step="5"
                max="720"
                defaultValue={this.props.overtime.minutes}
                onInput={this.onChange}
              />
            </div>
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              id="createBtn"
              className="btn btn-outline-primary"
              type="button"
              onClick={this.props.alterOvertime}
            >Изменить<span id="duration" className="badge badge-light ml-2"></span>
            </button>
          </div>
        </form >
      </div>
    );
  }

}
