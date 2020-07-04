import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, bring } from '../extra/extensions';
import actions from '../store/actions';
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
      loading: true
    }
    : {
      mode: "list",
      title: "список работников",
      titleLink: "Создать",
      currentId: null,
      loading: true
    }


  componentDidMount = async () => {
    let errors = "";

    if (this.props.users.length === 0)
      errors += await bring("user", this.props.fillUsers);

    if (this.props.offices.length === 0)
      errors += await bring("office", this.props.fillOffices);

    !!errors && this.setState({ error: errors, loading: false });
    !!!errors && this.setState({ loading: false })
  }



  ///// RENDER
  render() {
    if (this.state.loading)
      return <Loading />;

    let contents = [];

    if (this.state.mode === "list")
      contents = <UserList
        users={this.props.users}
        offices={this.props.offices}
        deleteUser={this.props.deleteUser}
      />

    else if (this.state.mode === "create")
      contents = <UserCreate
        createUser={this.createUser}
      />

    else if (this.state.mode === "alter")
      contents = <UserAlter
        user={this.props.users.find(u => u.id === this.state.currentId)}
        offices={this.props.offices}
        alterClick={this.alterUser}
      />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/user" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  createUser = async (e) => {
    e.preventDefault();

    const form = document.forms["CreateForm"];
    let name = form.elements["Name"].value;
    let num = form.elements["TabNum"].value;

    fetch("api/user", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        FullName: name,
        TabNum: num,
        ParticipateInLabour: false,
      })
    })
      .then(response => {
        response.json()
          .then(data => {
            if (response.ok) {
              this.props.addUser({ id: data, fullName: name, tabNum: num });
              blink(`Работник ${name} успешно добавлен`);
              this.linkToggle();
            }
            else
              blink(errorHandler(data), true);
          });
      });
  }


  alterUser = async () => {
    let user = this.props.users.find(u => u.id === this.state.currentId);

    const form = document.forms["alterForm"];
    user.fullName = form.elements["FullName"].value;
    user.officeId = +form.elements["officeId"].value;
    user.tabNum = form.elements["TabNum"].value;
    user.email = form.elements["Email"].value;
    user.phoneNum = form.elements["PhoneNum"].value;
    user.participateInLabour = form.elements["ParticipateInLabour"].checked ? true : false;
    user.medExam = form.elements["MedExam"].value;
    user.labourSecurityExam = form.elements["LabourSecurityExam"].value;
    user.industrialSecurityExam = form.elements["IndustrialSecurityExam"].value;
    user.gotHelmet = form.elements["GotHelmet"].value;
    user.gotSuit = form.elements["GotSuit"].value;
    user.gotBoots = form.elements["GotBoots"].value;
    user.gotCoat = form.elements["GotCoat"].value;

    let response = await fetch(`api/user`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: user.id,
        FullName: user.fullName,
        OfficeId: user.officeId,
        TabNum: user.tabNum,
        Email: user.email,
        PhoneNum: user.phoneNum,
        ParticipateInLabour: user.participateInLabour,
        MedExam: user.medExam,
        LabourSecurityExam: user.labourSecurityExam,
        IndustrialSecurityExam: user.industrialSecurityExam,
        GotHelmet: user.gotHelmet,
        GotSuit: user.gotSuit,
        GotBoots: user.gotBoots,
        GotCoat: user.gotCoat
      })
    })

    if (response.ok) {
      setTimeout(() => {
        blink(`Работник ${user.fullName} успешно изменен`);
      }, 10);
      return new Promise(resolve => resolve(true));
    }

    let data = await response.json();
    blink(errorHandler(data), true);
    return new Promise(resolve => resolve(false));
  }


  linkToggle = async (e) => {
    e.preventDefault();

    if (this.state.mode === "list") {
      this.setState({ mode: "create", titleLink: "Отмена", title: "добавить работника" });
    }
    else {
      history.push("/user");
      this.setState({ mode: "list", titleLink: "Создать", title: "список работников" });
    }
  }

}

/////////// MAP STATE
function chunkStateToProps(state) {
  return {
    users: state.users,
    offices: state.offices,
  }
}

export default connect(chunkStateToProps, actions)(Users);