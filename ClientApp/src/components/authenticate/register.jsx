import React, { Component } from 'react';
import { blink } from '../extra/extensions';


export default class Register extends Component {


  validate = e => {
    e && e.preventDefault();

    const login = document.getElementById("login");

    login.classList.add("is-invalid");
    if (!login.value.match(/^[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}$/)) {
      blink("Не верно введены Ф.И.О.", true);
      return;
    }
    if (this.props.users.some(u => u.fullName === login.value)) {
      blink("Пользователь с такими Ф.И.О. уже зарегистрирован", true);
      return;
    }
    login.classList.remove("is-invalid");
    login.classList.add("is-valid");

    const tabNum = document.getElementById("tabNum");
    if (!tabNum.value.match(/^\d{7}$/)) {
      tabNum.classList.add("is-invalid");
      blink("Не верно введен табельный номер", true);
      return;
    }
    tabNum.classList.remove("is-invalid");
    tabNum.classList.add("is-valid");

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    if (password.value !== confirmPassword.value && password.value !== "") {
      password.classList.add("is-invalid");
      confirmPassword.classList.add("is-invalid");
      blink("Пароли не совпадают", true);
      return;
    }

    let user = {
      fullName: login.value,
      tabNum: tabNum.value,
      password: password.value,
      participateInLabour: true,
    };

    this.props.register(user);
  }

  render() {

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-5 pl-0">
            <div className="form-group row">
              <label htmlFor="login" className="col-sm-3 col-form-label">Ф.И.О.</label>
              <div className="col-sm-9">
                <input type="text" className="form-control" id="login" placeholder="3 слова с большой буквы" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="tabNum" className="col-sm-3 col-form-label">Таб. №</label>
              <div className="col-sm-4">
                <input type="number" className="form-control" id="tabNum" placeholder="7 цифр" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="password" className="col-sm-3 col-form-label">Пароль</label>
              <div className="col-sm-6">
                <input type="password" className="form-control" id="password" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="confirmPassword" className="col-sm-3 col-form-label">Подтверждение</label>
              <div className="col-sm-6">
                <input type="password" className="form-control" id="confirmPassword" />
              </div>
            </div>
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={e => this.validate(e)}
            >Зарегистрироваться</button>
          </div>
        </form >
      </div >
    );
  }
}