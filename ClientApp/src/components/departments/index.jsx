import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fillDepts, fillOffices, fillUsers, deleteDept } from '../redux/actions';
import { blink, errorHandler, bring } from '../extra/extensions';
import history from '../extra/history';
import { Loading } from '../view/templates';

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
      loading: true,
    }
    : {
      mode: "list",
      title: "список отделов",
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
        .catch(error => this.setState({ error: error, loading: false }))
        .then(result => {
          this.props.fillDepts({
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
      return <div className="text-danger font-italic">{this.state.error}</div>

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
    e && e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать отдел" });
    else {
      history.push("/department");
      this.setState({ mode: "list", titleLink: "Создать", title: "список отделов" });
    }
  }

}

/////////// MAPPS
const chunkStateToProps = state => {
  return {
    depts: state.depts,
    offices: state.offices,
    users: state.users,
  }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({
    fillDepts,
    fillOffices,
    fillUsers,
    deleteDept
  }, dispatch);


export default connect(chunkStateToProps, chunkDispatchToProps)(Departments);