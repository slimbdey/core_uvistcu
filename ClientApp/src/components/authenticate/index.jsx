import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bring, blink } from '../extra/extensions';
import { fillUsers, addUser, authenticate } from '../redux/actions';

import Login from './login';
import Register from './register';



export class Authenticate extends Component {

  state = {
    mode: "Login",
    title: "Вход на сайт",
    titleLink: "Регистрация",
  }


  componentDidMount = () => {
    const request = ["user"];
    bring(request)
      .catch(error => this.setState({ error: error.message }))
      .then(result => this.props.fillUsers({ users: result.get("user") }))
  }


  //////////// RENDER
  render() {
    if (!!this.state.error)
      return <div className="text-danger font-italic">{this.state.error}</div>

    const contents = this.state.mode
      ? <Login users={this.state.users} login={this.login} />
      : <Register />


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
    console.log("linkToggle");
  }

  login = async e => {
    e && e.preventDefault();

    const fullName = document.getElementById("inputName").value;
    const password = document.getElementById("inputPassword").value;

    if (fullName === "" || password === "") {
      blink("Заполните поля формы пожалуйста", true);
      return;
    }

    let response = await fetch(`api/user/authenticate?FullName=${fullName}&Password=${password}`);

    if (response.ok) {
      let user = await response.json();

      fetch(`api/user/getuserrole/${user.id}`)
        .then(resp => resp.json())
        .then(role => this.props.authenticate({ user: user, role: role }))
        .then(setTimeout(() => blink(`Вы вошли как ${user.fullName}`), 500))
    }
    else
      blink("Неверный логин и/или пароль", true)
  }
}



/////////// MAPPS
const chunkStateToProps = state => {
  return { users: state.users }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({ fillUsers, addUser, authenticate }, dispatch);


export default connect(chunkStateToProps, chunkDispatchToProps)(Authenticate);