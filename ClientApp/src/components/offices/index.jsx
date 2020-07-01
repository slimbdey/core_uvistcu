import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, bring, log } from '../extra/extensions';
import actions from '../store/actions';

import OfficeList from './list'
import OfficeCreate from './create';
import OfficeAlter from './alter';


class Offices extends Component {
  displayName = Offices.name;


  state = {
    title: "список бюро",
    titleLink: "Создать",
    mode: "list",
    currentId: null
  }


  componentDidMount = async () => {
    if (this.props.offices.length === 0) {
      let offices = [];
      let users = [];

      let o = bring("office");
      let u = bring("user");

      let errors = "";
      let responses = await Promise.all([o, u])
        .catch(error => {
          blink(`Error: ${error}`, true);
          return;
        });

      responses[0].ok
        ? offices = await responses[0].json()
        : errors += "Бюро отсутствуют";

      responses[1].ok
        ? users = await responses[1].json()
        : errors += "Пользователи не заведены\n";

      !!errors && blink(errors, true);

      this.props.fillOffices(offices, users);
    }
  }



  ///// RENDER
  render() {
    let contents = [];

    if (this.state.mode === "list")
      contents = <OfficeList
        offices={this.props.offices}
        users={this.props.users}
        alterClick={this.alterClick}
        deleteOffice={this.props.deleteOffice}
      />

    else if (this.state.mode === "create")
      contents = <OfficeCreate
        users={this.props.users}
        createOffice={this.createOffice}
      />

    else if (this.state.mode === "alter")
      contents = <OfficeAlter
        office={this.props.offices.find(o => o.id === this.state.currentId)}
        users={this.props.users}
        alterClick={this.alterOffice}
      />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/office" className="text-primary" onClick={(e) => { e.preventDefault(); this.linkToggle(); }}>{this.state.titleLink}</a>
        <div className="text-success" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }



  createOffice = async () => {
    const form = document.forms["CreateForm"];
    let name = form.elements["Name"].value;
    let id = form.elements["ChiefId"].value;

    const response = await fetch("api/office", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        ChiefId: +id
      })
    });

    response.json()
      .then(data => {
        if (response.ok) {
          this.props.addOffice({ id: data, name: name, chiefId: id });
          blink(`Бюро ${name} успешно добавлено`);
          this.linkToggle();
        }
        else
          blink(errorHandler(data), true);
      })
  }


  alterOffice = async () => {
    let office = this.props.offices.find(o => o.id === this.state.currentId);
    office.chiefId = +document.getElementById("chiefId").value;

    const response = await fetch(`api/office`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: office.id,
        Name: office.name,
        ChiefId: office.chiefId,
        DeptId: +office.deptId
      })
    });

    if (response.ok) {
      blink(`Бюро ${office.name} успешно изменено`);
      this.linkToggle();
    }
    else {
      response.json()
        .then(error => blink(errorHandler(error), true));
    }
  }


  alterClick = async (id) => {
    this.setState({ mode: "alter", titleLink: "Назад", title: "изменить бюро", currentId: id });
  }


  linkToggle = async () => {
    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Назад", title: "создать бюро" });
    else
      this.setState({ mode: "list", titleLink: "Создать", title: "список бюро" });
  }

}

/////////// MAP STATE
function chunkStateToProps(state) {
  return {
    offices: state.offices,
    users: state.users,
  }
}

export default connect(chunkStateToProps, actions)(Offices);