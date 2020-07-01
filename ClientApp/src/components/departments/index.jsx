import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, bring } from '../extra/extensions';
import actions from '../store/actions';
import history from '../extra/history';

import DepartmentList from './list';
import DepartmentCreate from './create';
import DepartmentAlter from './alter';


class Departments extends Component {
  displayName = Departments.name;

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить отдел",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true
    }
    : {
      mode: "list",
      title: "список отделов",
      titleLink: "Создать",
      currentId: null,
      loading: true
    }


  componentDidMount = async () => {
    if (this.props.depts.length === 0) {
      let depts = [];
      let offices = [];
      let users = [];

      let d = bring("department");
      let o = bring("office");
      let u = bring("user");

      let errors = "";
      let responses = await Promise.all([d, o, u])
        .catch(error => {
          blink(`Error: ${error}`, true);
          return;
        });

      responses[0].ok
        ? depts = await responses[0].json()
        : errors += "Отделы отсутствуют\n";

      responses[1].ok
        ? offices = await responses[1].json()
        : errors += "Бюро отсутствуют";

      responses[2].ok
        ? users = await responses[2].json()
        : errors += "Работники отсутствуют";

      !!errors && blink(errors, true);
      this.props.fillDepts(depts, offices, users);
    }

    this.setState({ loading: false });
  }




  ///// RENDER
  render() {
    if (this.state.loading)
      return <img alt="Loading..." src="ajax_loader.gif" height={70} />;

    let contents = [];

    if (this.state.mode === "list")
      contents = <DepartmentList
        depts={this.props.depts}
        offices={this.props.offices}
        users={this.props.users}
        deleteDept={this.props.deleteDept}
      />

    else if (this.state.mode === "create")
      contents = <DepartmentCreate
        users={this.props.users}
        createDept={this.createDept}
      />

    else if (this.state.mode === "alter")
      contents = <DepartmentAlter
        dept={this.props.depts.find(d => d.id === this.state.currentId)}
        offices={this.props.offices}
        users={this.props.users}
        alterClick={this.alterDept}
      />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/department" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  createDept = () => {
    const form = document.forms["CreateForm"];
    let name = form.elements["Name"].value;
    let id = form.elements["ChiefId"].value;

    fetch("api/department", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        ManagerId: +id
      })
    })
      .then(response => {
        response.json()
          .then(data => {
            if (response.ok) {
              this.props.addDept({ id: data, name: name, managerId: id });
              blink(`Отдел ${name} успешно добавлен`);
              this.linkToggle();
            }
            else
              blink(errorHandler(data), true);
          });
      });
  }


  alterDept = async () => {
    let dept = this.props.depts.find(d => d.id === this.state.currentId);
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

    response.ok
      ? blink(`Отдел ${dept.name} успешно изменен`)
      : response.json().then(error => blink(errorHandler(error), true));
  }


  linkToggle = async (e) => {
    e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать отдел" });
    else {
      history.push("/department");
      this.setState({ mode: "list", titleLink: "Создать", title: "список отделов" });
    }
  }

}

/////////// MAP STATE
function chunkStateToProps(state) {
  return {
    depts: state.depts,
    offices: state.offices,
    users: state.users,
  }
}

export default connect(chunkStateToProps, actions)(Departments);