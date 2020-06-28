import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, log } from '../extra/extensions';
import actions from '../store/actions';

import { DepartmentList } from './list';
import { DepartmentCreate } from './create';
import { DepartmentAlter } from './alter';


class Departments extends Component {
  displayName = Departments.name;


  state = {
    mode: "list",
    linkText: "Создать",
    title: "список отделов",
    deptId: null
  }


  componentDidMount = async () => {
    let depts = [];
    let users = [];
    let offices = [];

    async function bring(source) {
      return await fetch(`api/${source}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      });
    }

    let d = bring("department");
    let u = bring("user");
    let o = bring("office");

    let errors = "";
    let responses = await Promise.all([d, u, o])
      .catch(error => {
        blink(`Error: ${error}`, true);
        return;
      });

    responses[0].ok
      ? depts = await responses[0].json()
      : errors += "Отделы отсутствуют\n";

    responses[1].ok
      ? users = await responses[1].json()
      : errors += "Пользователи не заведены\n";

    responses[2].ok
      ? offices = await responses[2].json()
      : errors += "Бюро отсутствуют";

    !!errors && blink(errors, true);

    this.props.fillDepts(depts, users, offices);
  }


  ///// RENDER
  render() {
    let contents = [];

    if (this.state.mode === "list")
      contents = <DepartmentList
        depts={this.props.depts}
        users={this.props.users}
        offices={this.props.offices}
        deleteDept={this.props.deleteDept}
        alterClick={this.alterClick}
        blink={blink}
      />

    else if (this.state.mode === "create")
      contents = <DepartmentCreate
        users={this.props.users}
        addDept={this.createDept}
        blink={blink}
      />

    else if (this.state.mode === "alter")
      contents = <DepartmentAlter
        state={this.props}
        deptId={this.state.deptId}
        alterClick={this.alterDept}
        blink={blink}
      />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/department" className="text-primary" onClick={(e) => { e.preventDefault(); this.linkToggle(); }}>{this.state.linkText}</a>
        <div className="text-success" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
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
        ManagerId: +id
      })
    });

    let data = await response.json();
    if (response.ok) {
      this.props.addDept({ id: data, name: name, managerId: id });
      blink(`Отдел ${name} успешно добавлен`);
      this.linkToggle();
    }
    else
      blink(errorHandler(data), true);
  }


  alterDept = async () => {
    let dept = this.props.depts.find(d => d.id === this.state.deptId);
    dept.managerId = +document.getElementById("managerId").value;

    const response = await fetch(`api/department`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: dept.id,
        Name: dept.name,
        ManagerId: dept.managerId,
      })
    });

    if (response.ok) {
      blink(`Отдел ${dept.name} успешно изменен`);
      this.setState({ mode: "list", linkText: "Создать", title: "список отделов" });
    }
    else {
      let data = await response.json();
      blink(errorHandler(data), true);
    }
  }


  alterClick = async (id) => {
    this.setState({ mode: "alter", linkText: "Назад", title: "изменить отдел", deptId: id });
  }


  linkToggle = async () => {
    if (this.state.mode === "list")
      this.setState({ mode: "create", linkText: "Назад", title: "создать отдел" });
    else
      this.setState({ mode: "list", linkText: "Создать", title: "список отделов" });
  }

}

/////////// MAP STATE
function mapStateToProps(state) {
  return {
    depts: state.deptReducer.depts,
    users: state.deptReducer.users,
    offices: state.deptReducer.offices,
    title: state.deptReducer.title,
  }
}

export default connect(mapStateToProps, actions)(Departments);