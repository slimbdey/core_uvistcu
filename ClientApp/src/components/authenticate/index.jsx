import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bring, blink, setCookie, getCookie, errorHandler } from '../extra/extensions';
import { fillUsers, addUser, alterUser, authenticate } from '../redux/actions';
import history from '../extra/history';

import Login from './login';
import Alter from './alter';
import Register from './register';



export class Authenticate extends Component {

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "Изменить учетные данные",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id
    }
    : {
      mode: "login",
      title: "Вход на сайт",
      titleLink: "Регистрация",
    }


  componentDidMount = () => {
    const request = ["user"];
    bring(request)
      .catch(error => this.setState({ error: error.message }))
      .then(result => this.props.fillUsers({ users: result.get("user") }))
      .then(() => {
        let user = +getCookie("user");

        if (user) {
          fetch(`api/user/${user}`)
            .then(response => response.json())
            .then(user => {
              fetch(`api/user/getuserrole/${user.id}`)
                .then(resp => resp.json())
                .then(data => this.props.authenticate({ user: user, role: data }))
            })
        }
      });
  }


  //////////// RENDER
  render() {
    if (!!this.state.error)
      return <div className="text-danger font-italic">{this.state.error}</div>

    const contents = this.state.mode === "login"
      ? <Login users={this.state.users} login={this.login} />
      : this.state.mode === "alter"
        ? <Alter
          user={this.props.users.find(u => u.id === this.state.currentId)}
          alter={this.alter}
        />
        : <Register register={this.register} users={this.props.users} />


    return (
      <div>
        <div className="display-5 text-uppercase text-muted">{this.state.title}</div>
        <a href="/" className="text-primary" onClick={e => this.linkToggle(e)}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  linkToggle = e => {
    e && e.preventDefault();

    if (this.state.mode === "login")
      this.setState({ mode: "register", titleLink: "Отмена", title: "регистрация" });

    else {
      this.setState({ mode: "login", titleLink: "Регистрация", title: "Вход на сайт" });
      history.push("/");
    }
  }

  login = async (fullName, password) => {
    if (fullName === "" || password === "") {
      blink("Заполните поля формы пожалуйста", true);
      return;
    }

    let response = await fetch(`api/user/authenticate?FullName=${fullName}&Password=${password}`);

    if (response.ok) {
      let user = await response.json();

      fetch(`api/user/getuserrole/${user.id}`)
        .then(resp => resp.json())
        .then(role => {
          this.props.authenticate({ user: user, role: role })
          setCookie("user", user.id);
          setCookie("role", role.id);
        })
    }
    else
      blink("Неверный логин и/или пароль", true)
  }

  alter = async () => {
    let user = this.props.user;
    user.fullName = document.getElementById("inputName").value;

    const newPwd = document.getElementById("newPassword");
    newPwd
      ? user.password = newPwd.value
      : user.password = document.getElementById("oldPassword").value;

    let response = await fetch(`api/user`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });

    response.ok
      ? blink("Учетные данные успешно изменены")
        .then(() => this.props.alterUser(user))
        .then(() => this.linkToggle())

      : response.json()
        .then(error => blink(errorHandler(error), true));
  }

  register = async user => {
    fetch("api/user", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    })
      .then(response => {
        response.json()
          .then(data => {
            if (response.ok) {
              user.id = +data
              this.props.addUser(user);
              this.login(user.fullName, user.password);
            }
            else
              blink(errorHandler(data), true);
          });
      });
  }
}



/////////// MAPPS
const chunkStateToProps = state => {
  return { users: state.users, user: state.user }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({ fillUsers, addUser, alterUser, authenticate }, dispatch);


export default connect(chunkStateToProps, chunkDispatchToProps)(Authenticate);