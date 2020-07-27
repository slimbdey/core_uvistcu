import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { blink, errorHandler, bring } from '../extra/extensions';
import { fillUsers, addUser, deleteUser, alterUser } from '../redux/actions';
import history from '../extra/history';

import UserList from './list'
import UserCreate from './create';
import UserAlter from './alter';
import { Loading } from '../view/templates';


class Users extends Component {
  displayName = Users.name;


  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить работника",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true,
    }
    : {
      mode: "list",
      title: "список работников",
      titleLink: "Создать",
      currentId: null,
      loading: true,
    }


  componentDidMount = () => {
    let request = [];

    if (this.props.depts.length === 0)
      request.push("department");

    if (this.props.offices.length === 0)
      request.push("office");

    if (this.props.users.length === 0)
      request.push("user");

    request.length > 0
      ? bring(request)
        .catch(error => {
          debugger;
          this.setState({ error: error.message, loading: false })
        })
        .then(result => {
          this.props.fillUsers({
            depts: result.get("department"),
            offices: result.get("office"),
            users: result.get("user"),
          });
          this.setState({ loading: false });
        })
      : this.setState({ loading: false });
  }



  ///// RENDER
  render() {
    if (this.state.loading)
      return <Loading />;

    else if (!!this.state.error)
      return <div className="text-danger font-italic">{this.state.error}</div>;

    let contents = [];

    if (this.state.mode === "list")
      contents = <UserList
        users={this.props.users}
        depts={this.props.depts}
        offices={this.props.offices}
        deleteUser={this.props.deleteUser}
      />

    else if (this.state.mode === "create")
      contents = <UserCreate
        depts={this.props.depts}
        offices={this.props.offices}
        createUser={this.createUser}
      />

    else if (this.state.mode === "alter")
      contents = <UserAlter
        user={this.props.users.find(u => u.id === this.state.currentId)}
        depts={this.props.depts}
        offices={this.props.offices}
        alterClick={this.alterUser}
      />

    return (
      <div>
        <div className="display-5 text-uppercase text-muted">{this.state.title}</div>
        <a href="/user" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  createUser = () => {
    const form = document.forms["CreateForm"];

    let user = {};
    user.fullName = form.elements["FullName"].value;
    user.tabNum = form.elements["TabNum"].value;
    user.deptId = +form.elements["deptId"].value;
    user.officeId = +form.elements["officeId"].value;
    const handleDate = value => value === "" ? new Date('1800-01-01').toISOString() : value;
    user.medExam = handleDate(form.elements["MedExam"].value);
    user.participateInLabour = form.elements["ParticipateInLabour"].checked ? true : false;

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
              blink(`Работник ${user.fullName} успешно добавлен`);
              this.linkToggle();
            }
            else
              blink(errorHandler(data), true);
          });
      });
  }


  alterUser = async () => {
    let user = Object.assign({}, this.props.users.find(u => u.id === this.state.currentId));

    const handleDate = value => value === "" ? new Date('1800-01-01').toISOString() : value;

    const form = document.forms["alterForm"];
    user.fullName = form.elements["FullName"].value;
    user.deptId = +form.elements["deptId"].value;
    user.officeId = +form.elements["officeId"].value;
    user.tabNum = form.elements["TabNum"].value;
    user.email = form.elements["Email"].value;
    user.phoneNum = form.elements["PhoneNum"].value;
    user.participateInLabour = form.elements["ParticipateInLabour"].checked ? true : false;
    user.medExam = handleDate(form.elements["MedExam"].value);
    user.labourSecurityExam = handleDate(form.elements["LabourSecurityExam"].value);
    user.industrialSecurityExam = handleDate(form.elements["IndustrialSecurityExam"].value);
    user.gotHelmet = handleDate(form.elements["GotHelmet"].value);
    user.gotSuit = handleDate(form.elements["GotSuit"].value);
    user.gotBoots = handleDate(form.elements["GotBoots"].value);
    user.gotCoat = handleDate(form.elements["GotCoat"].value);

    let response = await fetch(`api/user`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });

    response.ok
      ? blink(`Работник ${user.fullName} успешно изменен`)
        .then(this.props.alterUser(user))

      : response.json()
        .then(error => blink(errorHandler(error), true));
  }


  linkToggle = async (e) => {
    e && e.preventDefault();

    if (this.state.mode === "list") {
      this.setState({ mode: "create", titleLink: "Отмена", title: "добавить работника" });
    }
    else {
      history.push("/user");
      this.setState({ mode: "list", titleLink: "Создать", title: "список работников" });
    }
  }

}

/////////// MAPPS
const chunkStateToProps = state => {
  return {
    users: state.users,
    offices: state.offices,
    depts: state.depts,
  }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({
    fillUsers,
    deleteUser,
    addUser,
    alterUser
  }, dispatch);


export default connect(chunkStateToProps, chunkDispatchToProps)(Users);