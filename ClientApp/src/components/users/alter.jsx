import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { DateGroup, InputGroup, OptionsInputGroup, Loading } from '../view/templates';
import { blink, errorHandler } from '../extra/extensions';


export default class UserAlter extends Component {
  displayName = UserAlter.name;

  state = {
    loading: true
  }

  componentDidMount = () => {
    fetch(`api/user/getroles`)
      .then(response =>
        response.json()
          .then(data => {
            response.ok
              ? this.setState({ roles: data, loading: false })
              : blink(errorHandler(data, true))
          })
      );
  }


  /////// RENDER
  render() {
    if (this.state.loading)
      return <Loading />;

    let user = this.props.user;
    const none = <option key={0} value={0}>- нет -</option>;
    const offices = [none, ...this.props.offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)];
    const depts = [none, ...this.props.depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)]
    let roles = [];
    if (this.state.roles)
      roles = this.state.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)

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
              <OptionsInputGroup hint="Отдел" name="deptId" value={user.deptId} options={depts} />
              <OptionsInputGroup hint="Группа" name="officeId" value={user.officeId} options={offices} />
              {this.props.role.id > 2 && <OptionsInputGroup hint="Роль" name="roleId" value={this.props.user.roleId} options={roles} />}

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
                  history.push('/user');
                  this.props.alterClick()
                }}
              >Изменить</button>
            )} />
          </div>
        </form >
      </div >
    );
  }

}