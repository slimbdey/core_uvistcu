import React, { Component } from 'react';
import { OptionsInputGroup, DateGroup } from '../view/templates';
import moment from 'moment';


export default class VacationCreate extends Component {

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

  /////// RENDER
  render() {
    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

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
            <DateGroup name="beginDate" hint="Дата начала" onChange={this.onChange} value={new Date().toISOString().slice(0, 10)} />

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
              onClick={this.props.createVacation}
            >Создать<span id="days" className="badge badge-light ml-2">0 дней</span>
            </button>
          </div>
        </form >
      </div >
    );
  }

}

