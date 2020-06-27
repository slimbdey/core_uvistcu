import React, { Component } from 'react';
import { connect } from 'react-redux';
import { errorHandler } from '../extra/errorHandler';
import actions from '../store/actions';

import { DepartmentList } from './list'
import { DepartmentCreate } from './create';
import { DepartmentDetails } from './details';


class Departments extends Component {
  static displayName = Departments.name;


  state = {
    mode: "list",
    linkText: "Создать",
    title: "список отделов"
  }


  componentDidMount = async () => {
    const a = this.getDepts();
    const b = this.getUsers();
    Promise.all([a, b]);
  }


  ///// RENDER
  render() {
    let contents = [];
    if (this.state.mode === "list")
      contents = <DepartmentList depts={this.props.depts} users={this.props.users} deleteDept={this.props.deleteDept} blink={this.blink} />

    else if (this.state.mode === "create")
      contents = <DepartmentCreate users={this.props.users} blink={this.blink} addDept={this.createDept} />

    else if (this.state.mode === "details")
      contents = <DepartmentDetails offices={this.props.offices} fillOffices={this.props.fillOffices} blink={this.blink} />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/department" className="text-primary" onClick={(e) => { e.preventDefault(); this.linkToggle(); }}>{this.state.linkText}</a>
        <div className="text-success" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  getDepts = async () => {
    const response = await fetch('api/department', {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0)
        this.props.fillDepts(data);

      else
        this.blink("Отделы отсутствуют", true);
    }
    else
      this.blink(`Error: ${response.statusText}`, true);

    await this.getUsers();
  }


  getUsers = async () => {
    const response = await fetch('api/user', {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0)
        this.props.fillUsers(data);
    }
    else
      this.props.blink("Не могу найти пользователей", true);
  }


  createDept = async () => {
    const form = document.forms["CreateForm"];
    let name = form.elements["Name"].value;
    let id = form.elements["ChiefId"].value;

    const response = await fetch("api/department", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        managerId: id
      })
    });

    let data = await response.json();
    if (response.ok) {
      this.props.addDept(data);
      this.blink(`Отдел ${data.name} успешно добавлен`);
      this.linkToggle();
    }
    else
      this.blink(errorHandler(data), true);
  }


  linkToggle = async () => {
    if (this.state.mode === "list")
      this.setState({ mode: "create", linkText: "Назад", title: "создать отдел" });
    else
      this.setState({ mode: "list", linkText: "Создать", title: "список отделов" });
  }


  blink = async (message, bad = false) => {
    let popup = document.getElementById("message");

    if (bad)
      popup.classList.replace("text-success", "text-danger");

    popup.innerText = message;
    popup.style.opacity = 1;

    setTimeout(() => {
      popup.style.opacity = 0;
      setTimeout(() => popup.classList.replace("text-danger", "text-success"), 500);
    }, 2000);
  }

}

/////////// MAP STATE
function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, actions)(Departments);