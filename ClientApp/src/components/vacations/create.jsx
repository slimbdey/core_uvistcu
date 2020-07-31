import React, { Component } from 'react';
import { OptionsInputGroup, DateGroup } from '../view/templates';
import moment from 'moment';
import { blink } from '../extra/extensions';


export default class VacationCreate extends Component {

  state = {
    min: new Date(`${new Date().getFullYear() + 1}-01-01`),
    max: new Date(`${new Date().getFullYear() + 1}-12-31`),
  }

  componentDidMount = () => this.onChange();

  onChange = () => {
    let range = +document.getElementById("range").value;
    let begin = document.getElementsByName("beginDate")[0].value;
    let span = document.getElementById("days");
    let btn = document.getElementById("bCreate");

    if (moment(begin).isValid() && range > 0) {
      span.innerText = `${range} дней`;
      btn.disabled = false;
    }
    else {
      span.innerText = "0 дней";
      btn.disabled = true;
    }
  }


  validate = () => {
    let date = new Date(document.getElementsByName("beginDate")[0].value);
    if (date < this.state.min || date > this.state.max) {
      blink("Дата вне допустимых пределов", true);
      return;
    }
    this.props.createVacation();
  }


  /////// RENDER
  render() {
    const user = this.props.users.find(u => u.id === this.props.voterId);

    let options = this.props.role.id > 1
      ? this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>)
      : <option key={user.id} value={user.id}>{user.fullName}</option>;

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0">
            <OptionsInputGroup
              reversed
              hint="Работник"
              name="userId"
              options={options}
              value={this.props.voterId}
            />
            <DateGroup
              name="beginDate"
              hint="Дата начала"
              onChange={this.onChange}
              value={this.state.min.toISOString().slice(0, 10)}
              min={this.state.min.toISOString().slice(0, 10)}
              max={this.state.max.toISOString().slice(0, 10)}
            />

            <div className="form-group">
              <label htmlFor="range" className="text-muted">Продолжительность:</label>
              <input
                type="range"
                className="form-control-range"
                id="range"
                min="0"
                max="28"
                defaultValue="14"
                onInput={this.onChange}
              />
            </div>
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              id="bCreate"
              onClick={() => this.validate()}
            >Создать<span id="days" className="badge badge-light ml-2">0 дней</span>
            </button>
          </div>
        </form >
      </div >
    );
  }

}

