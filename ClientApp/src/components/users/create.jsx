import React, { Component } from 'react';
import { InputGroup, OptionsInputGroup, DateGroup } from '../view/templates';


export default class OfficeCreate extends Component {

  /////// RENDER
  render() {
    const none = <option key={0} value={0}>- нет -</option>;
    const offices = [none, ...this.props.offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)];
    const depts = [none, ...this.props.depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)]

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-5 pl-0">
            <InputGroup name="FullName" value="" hint="Ф.И.О." placeholder="Петров Петр Петрович" />
            <InputGroup name="TabNum" value="" hint="Таб. №" placeholder="7 цифр" />
            <OptionsInputGroup hint="Отдел" name="deptId" options={depts} />
            <OptionsInputGroup hint="Группа" name="officeId" options={offices} />
            <DateGroup name="MedExam" hint="Медосмотр" />
            <div className="input-group form-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Участвует в субботниках</span>
              </div>
              <div className="input-group-append">
                <div className="input-group-text">
                  <input type="checkbox" name="ParticipateInLabour" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.props.createUser}
            >Создать</button>
          </div>
        </form >
      </div >
    );
  }

}