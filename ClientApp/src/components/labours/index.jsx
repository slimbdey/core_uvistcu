import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, bring } from '../extra/extensions';
import actions from '../store/actions';
import history from '../extra/history';
import { Loading } from '../view/templates';

import LabourList from './list';
import LabourCreate from './create';
import LabourAlter from './alter';


class Labours extends Component {
  displayName = Labours.name;

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить субботник",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true,
      error: ""
    }
    : {
      mode: "list",
      title: "список субботников",
      titleLink: "Создать",
      currentId: null,
      loading: true,
      error: ""
    }


  componentDidMount = async () => {
    let errors = "";

    if (this.props.labours.length === 0)
      errors += await bring("labour", this.props.fillLabours);

    if (this.props.users.length === 0)
      errors += await bring("user", this.props.fillUsers);

    !!errors && this.setState({ error: errors, loading: false });
    !!!errors && this.setState({ loading: false })
  }




  ///// RENDER
  render() {
    if (this.state.loading)
      return <Loading />;

    else if (!!this.state.error)
      return <div className="text-danger font-italic">{this.state.error}</div>

    let contents = [];

    if (this.state.mode === "list")
      contents = <LabourList
        labours={this.props.labours}
        users={this.props.users}
        deleteLabour={this.props.deleteLabour}
      />

    if (this.state.mode === "create")
      contents = <LabourCreate
        users={this.props.users}
        createLabour={this.createLabour}
      />

    else if (this.state.mode === "alter")
      contents = <LabourAlter
        users={this.props.users}
        labour={this.props.labours.find(l => l.id === this.state.currentId)}
        alterClick={this.alterLabour}
      />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/labour" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  createLabour = () => {
    const form = document.forms["CreateForm"];
    let date = new Date(form.elements["Date"].value).toISOString();
    let managerId = form.elements["ManagerId"].value;
    let users = form.elements["Users[]"];
    let userIds = [];

    if (users.nodeName === "SELECT")
      userIds.push(+users.value);

    else {
      for (let user of users)
        if (userIds.includes(+user.value)) {
          blink("Один из работников указан дважды", true);
          return;
        }

        else
          userIds.push(+user.value);
    }

    fetch("api/labour", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Date: date,
        ManagerId: +managerId,
        UserIds: userIds
      })
    })
      .then(response =>
        response.json()
          .then(data => {
            if (response.ok) {
              this.props.addLabour({ id: data, date: date, managerId: +managerId, userIds: userIds });
              blink(`Субботник успешно добавлен`);
              this.linkToggle();
            }
            else
              blink(errorHandler(data), true);
          })
      );
  }


  alterLabour = async () => {
    const form = document.forms["CreateForm"];

    let labour = { id: +this.state.currentId };
    labour.date = new Date(form.elements["Date"].value).toISOString();
    labour.managerId = +form.elements["ManagerId"].value;

    let users = form.elements["Users[]"];
    labour.userIds = [];

    if (users.nodeName === "SELECT")
      labour.userIds.push(+users.value);

    else {
      for (let user of users)
        if (labour.userIds.includes(+user.value)) {
          blink("Один из работников указан дважды", true);
          return;
        }

        else
          labour.userIds.push(+user.value);
    }

    let response = await fetch("api/labour", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(labour)
    });

    if (response.ok) {
      setTimeout(() => blink(`Субботник успешно изменен`), 10);
      this.props.alterLabour(labour);
      return new Promise(resolve => resolve(true));
    }

    response.json()
      .then(data => {
        blink(errorHandler(data), true);
        return new Promise(resolve => resolve(false));
      });
  }


  linkToggle = async (e) => {
    e && e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать субботник" });
    else {
      history.push("/labour");
      this.setState({ mode: "list", titleLink: "Создать", title: "список субботников" });
    }
  }

}

/////////// MAP STATE
function chunkStateToProps(state) {
  return {
    labours: state.labours,
    users: state.users,
  }
}

export default connect(chunkStateToProps, actions)(Labours);