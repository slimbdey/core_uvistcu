import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { blink, errorHandler, bring } from '../extra/extensions';
import { fillOvertimes, alterOvertime, addOvertime, deleteOvertime } from '../redux/actions';
import history from '../extra/history';
import { Loading } from '../view/templates';

import OvertimeList from './list';
import OvertimeCreate from './create';
import OvertimeAlter from './alter';


class Overtimes extends Component {
  displayName = Overtimes.name;

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить переработку",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true,
      error: ""
    }
    : {
      mode: "list",
      title: "список переработок",
      titleLink: "Создать",
      currentId: null,
      loading: true,
      error: ""
    }


  componentDidMount = async () => {
    let request = [];

    if (this.props.overtimes.length === 0)
      request.push("overtime");

    if (this.props.users.length === 0)
      request.push("user");

    if (this.props.depts.length === 0)
      request.push("department");

    if (this.props.offices.length === 0)
      request.push("office");

    request.length > 0
      ? bring(request)
        .catch(error => this.setState({ error: error, loading: false }))
        .then(result => {
          this.props.fillOvertimes({
            overtimes: result.get("overtime"),
            users: result.get("user"),
            depts: result.get("department"),
            offices: result.get("office")
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
      contents = <OvertimeList
        overtimes={this.props.overtimes}
        depts={this.props.depts}
        offices={this.props.offices}
        users={this.props.users}
        deleteOvertime={this.props.deleteOvertime}
        alterOvertime={this.alterOvertime}
      />

    if (this.state.mode === "create")
      contents = <OvertimeCreate
        users={this.props.users}
        createOvertime={this.createOvertime}
      />

    else if (this.state.mode === "alter")
      contents = <OvertimeAlter
        users={this.props.users}
        overtime={this.props.overtimes.find(l => l.id === this.state.currentId)}
        alterOvertime={this.alterOvertime}
      />



    return (
      <div>
        <div className="display-5 text-uppercase text-muted">{this.state.title}</div>
        <a href="/overtime" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  createOvertime = () => {
    const form = document.forms["CreateForm"];
    let date = new Date(form.elements["Date"].value).toISOString();
    let userId = +form.elements["UserId"].value;
    let minutes = +form.elements["Range"].value;

    let overtime = { userId: userId, date: date, minutes: minutes };

    fetch("api/overtime", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(overtime)
    })
      .then(response =>
        response.json()
          .then(data => {
            if (response.ok) {
              overtime.id = data;
              this.props.addOvertime(overtime);
              blink(`Переработка успешно добавлена`);
              this.linkToggle();
            }
            else
              blink(errorHandler(data), true);
          })
      );
  }


  alterOvertime = async () => {
    const form = document.forms["CreateForm"];
    let date = new Date(form.elements["Date"].value).toISOString();
    let userId = +form.elements["UserId"].value;
    let minutes = +form.elements["Range"].value;

    let overtime = { id: +this.state.currentId, userId: userId, date: date, minutes: minutes };

    fetch("api/overtime", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(overtime)
    })
      .then(response =>
        response.json()
          .then(data => {
            if (response.ok) {
              overtime.id = data;
              this.props.alterOvertime(overtime);
              blink(`Переработка успешно изменена`);
              this.linkToggle();
            }
            else
              blink(errorHandler(data), true);
          })
      );
  }


  linkToggle = async (e) => {
    e && e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать переработку" });
    else {
      history.push("/overtime");
      this.setState({ mode: "list", titleLink: "Создать", title: "список переработок" });
    }
  }

}

/////////// MAPPS
const chunkStateToProps = state => {
  return {
    overtimes: state.overtimes,
    users: state.users,
    depts: state.depts,
    offices: state.offices,
  }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({
    fillOvertimes,
    deleteOvertime,
    alterOvertime,
    addOvertime,
  }, dispatch)


export default connect(chunkStateToProps, chunkDispatchToProps)(Overtimes);