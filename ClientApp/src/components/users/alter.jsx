import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { DateGroup, InputGroup } from '../view/templates';


export default class UserAlter extends Component {
  displayName = UserAlter.name;

  /////// RENDER
  render() {
    let user = this.props.user;
    let offices = this.props.offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>);

    return (
      <div>
        <form name="alterForm" className="d-flex flex-column">
          <div className="d-flex flex-row col-md-12 pl-0">

            <div className="col-md-6 pl-0">
              <button type="submit" disabled style={{ display: 'none' }} ></button>

              <InputGroup name="FullName" value={user.fullName} hint="Ф.И.О." />
              <InputGroup name="TabNum" value={user.tabNum} hint="Таб. №" />
              <InputGroup name="Email" value={user.email} hint="Email" />
              <InputGroup name="PhoneNum" value={user.phoneNum} hint="Телефон" />

              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Бюро</span>
                </div>
                <select
                  className="custom-select"
                  name="officeId"
                  defaultValue={user.officeId}
                >{offices}</select>
              </div>

              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Участвует в субботниках</span>
                </div>
                <div className="input-group-append">
                  <div className="input-group-text">
                    {user.participateInLabour
                      ? <input type="checkbox" name="ParticipateInLabour" defaultValue={user.participateInLabour} defaultChecked />
                      : <input type="checkbox" name="ParticipateInLabour" defaultValue={user.participateInLabour} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="mr-5">&nbsp;</div>

            <div className="col-md-5">
              <DateGroup name="MedExam" value={user.medExam} hint="Медосмотр" />
              <DateGroup name="LabourSecurityExam" value={user.labourSecurityExam} hint="Охрана труда" />
              <DateGroup name="IndustrialSecurityExam" value={user.industrialSecurityExam} hint="Промбезопасность" />
              <DateGroup name="GotHelmet" value={user.gotHelmet} hint="Получил каску" />
              <DateGroup name="GotSuit" value={user.gotSuit} hint="Получил костюм" />
              <DateGroup name="GotBoots" value={user.gotBoots} hint="Получил ботинки" />
              <DateGroup name="GotCoat" value={user.gotCoat} hint="Получил зимний костюм" />
            </div>
          </div>

          <div className="mb-4 col-md-3 pl-0"><br /><hr />
            <Route render={({ history }) => (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  this.props.alterClick()
                    .then(result => {
                      if (result)
                        history.push('/user');
                    });
                }}
              >Изменить
              </button>
            )} />
          </div>
        </form >
      </div >
    );
  }

}