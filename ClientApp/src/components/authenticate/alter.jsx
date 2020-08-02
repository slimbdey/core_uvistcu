import React, { Component, Fragment } from 'react';


export default class Alter extends Component {

  state = {
    btnText: "Изменить",
    alterPwd: false,
    changesValid: true
  }


  toggle = () => this.setState({
    alterPwd: !this.state.alterPwd,
    btnText: this.state.alterPwd ? "Изменить" : "Не изменять",
    changesValid: this.state.alterPwd
  })


  oldPwd = () => {
    const oldPassword = document.getElementById("oldPassword");
    const oldPasswordFeedback = document.getElementById("oldPasswordFeedback");

    oldPassword.classList.remove("is-invalid");
    oldPassword.classList.add("is-valid");
    oldPasswordFeedback.innerText = "";

    if (oldPassword.value !== this.props.user.password) {
      oldPassword.classList.remove("is-valid");
      oldPassword.classList.add("is-invalid");
      oldPasswordFeedback.innerText = "Старый пароль введен не верно";
    }
  }

  newPwd = () => {
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const confirmPasswordFeedback = document.getElementById("confirmPasswordFeedback");


    if (confirmPassword.value !== newPassword.value || newPassword.value === "") {
      confirmPassword.classList.remove("is-valid");
      confirmPassword.classList.add("is-invalid");
      newPassword.value === ""
        ? confirmPasswordFeedback.innerText = "Новый пароль не может быть пустым"
        : confirmPasswordFeedback.innerText = "Подтверждение не совпадает с новым паролем";
      this.setState({ changesValid: false });
    }
    else {
      confirmPassword.classList.remove("is-invalid");
      confirmPassword.classList.add("is-valid");
      confirmPasswordFeedback.innerText = "";
      this.setState({ changesValid: true });
    }
  }


  /////// RENDER
  render() {

    return (
      <form className="mt-3">
        <div className="col-md-5 pl-0 text-right">
          <button type="submit" disabled style={{ display: 'none' }} ></button>
          <div className="form-group row">
            <label htmlFor="inputName" className="col-sm-3 col-form-label">Ф.И.О.</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="inputName" defaultValue={this.props.user.fullName} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="oldPassword" className="col-sm-3 col-form-label">Пароль</label>
            <div className="col-sm-9 input-group">
              <input type="password" className="form-control" id="oldPassword" defaultValue={this.props.user.password} onBlur={() => this.oldPwd()} />
              <div className="input-group-append">
                <button type="button" onClick={() => this.toggle()} className="btn btn-outline-secondary">{this.state.btnText}</button>
              </div>
              <div id="oldPasswordFeedback" className="invalid-feedback"></div>
            </div>
          </div>
          {this.state.alterPwd &&
            <Fragment>
              <div className="form-group row">
                <label htmlFor="newPassword" className="col-sm-3 col-form-label">Новый пароль</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" id="newPassword" />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="confirmPassword" className="col-sm-3 col-form-label">Пароль еще раз</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" id="confirmPassword" onBlur={() => this.newPwd()} />
                  <div id="confirmPasswordFeedback" className="invalid-feedback"></div>
                </div>
              </div>
            </Fragment>}
        </div>
        <div className="col-md-3 mt-5 pl-0">
          <hr />
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => this.state.changesValid && this.props.alter()}
          >Изменить</button>
        </div>
      </form>
    );
  }

}