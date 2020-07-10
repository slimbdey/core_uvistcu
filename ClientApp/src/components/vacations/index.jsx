import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fillVacations, deleteVacation, addVacation, alterVacation } from '../redux/actions';
import { blink, errorHandler, bring } from '../extra/extensions';
import history from '../extra/history';
import { Loading } from '../view/templates';

import VacationList from './list';
//import VacationCreate from './create';
//import VacationAlter from './alter';


class Vacation extends Component {
  displayName = Vacation.name;

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить отпуск",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true,
    }
    : {
      mode: "list",
      title: "список отпусков",
      titleLink: "Создать",
      currentId: null,
      loading: true,
    }


  componentDidMount = () => {
    let request = [];

    if (this.props.vacations.length === 0)
      request.push("vacation");

    if (this.props.users.length === 0)
      request.push("user");

    if (this.props.depts.length === 0)
      request.push("department");

    if (this.props.offices.length === 0)
      request.push("office");

    request.length > 0
      ? bring(request)
        .catch(error => this.setState({ error: error, loading: false }))
        .then(result => this.props.fillVacations({
          vacations: result.get("vacation"),
          users: result.get("user"),
          depts: result.get("department"),
          offices: result.get("office"),
        }))
        .then(this.setState({ loading: false }))

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
      contents = <VacationList
        vacations={this.props.vacations}
        offices={this.props.offices}
        users={this.props.users}
        depts={this.props.depts}
        deleteVacation={this.props.deleteVacation}
      />

    //else if (this.state.mode === "create")
    //  contents = <VacationCreate
    //    users={this.props.users}
    //    createDept={this.createDept}
    //  />

    //else if (this.state.mode === "alter")
    //  contents = <VacationAlter
    //    vacation={this.props.vacations.find(d => d.id === this.state.currentId)}
    //    offices={this.props.offices}
    //    users={this.props.users}
    //    alterClick={this.alterDept}
    //  />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/vacation" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  createDept = () => {
    const form = document.forms["CreateForm"];
    let name = form.elements["Name"].value;
    let id = form.elements["ChiefId"].value;

    fetch("api/vacation", {
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
    let vacation = this.props.vacations.find(d => d.id === this.state.currentId);
    vacation.managerId = +document.getElementById("managerId").value;

    const response = await fetch(`api/vacation`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: vacation.id,
        Name: vacation.name,
        ManagerId: vacation.managerId,
      })
    });

    response.ok
      ? blink(`Отдел ${vacation.name} успешно изменен`)
      : response.json().then(error => blink(errorHandler(error), true));
  }


  linkToggle = async (e) => {
    e && e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать отпуск" });
    else {
      history.push("/vacation");
      this.setState({ mode: "list", titleLink: "Создать", title: "список отпусков" });
    }
  }

}

/////////// MAPPS
const chunkStateToProps = state => {
  return {
    vacations: state.vacations,
    users: state.users,
    depts: state.depts,
    offices: state.offices
  }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({
    fillVacations,
    alterVacation,
    addVacation,
    deleteVacation
  }, dispatch);


export default connect(chunkStateToProps, chunkDispatchToProps)(Vacation);