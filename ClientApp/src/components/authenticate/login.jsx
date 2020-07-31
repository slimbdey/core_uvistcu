import React, { Component } from 'react';


export default class Login extends Component {

  validate = type => {
    const input = document.getElementById(`input${type}`);
    const feedback = document.getElementById(`feedback${type}`);

    const reg = type === "Name"
      ? input.value.match(/^[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}$/)
      : input.value.match(/.+/);


    if (reg === null) {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      feedback.innerText = type === "Name"
        ? "Введите Ваше имя корректно - 3 слова с больших букв"
        : "Вы не ввели пароль";
      feedback.classList.remove("valid-feedback");
      feedback.classList.add("invalid-feedback");
    }
    else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      feedback.innerText = type === "Name" ? "Имя корректно" : "Пароль введен";
      feedback.classList.remove("invalid-feedback");
      feedback.classList.add("valid-feedback");
    }
  }



  render() {

    return (
      <form>
        <div className="col-md-5 pl-0">
          <button type="submit" disabled style={{ display: 'none' }} ></button>
          <div className="form-group row">
            <label htmlFor="inputName" className="col-sm-2 col-form-label">Ф.И.О.</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="inputName" onBlur={() => this.validate("Name")} />
              <div id="feedbackName"></div>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Пароль</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" id="inputPassword" onBlur={() => this.validate("Password")} />
              <div id="feedbackPassword"></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-5 pl-0">
          <hr />
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => this.props.login(document.getElementById("inputName").value, document.getElementById("inputPassword").value)}
          >Войти</button>
        </div>
      </form>
    );
  }
}