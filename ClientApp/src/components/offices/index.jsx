import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, bring } from '../extra/extensions';
import actions from '../store/actions';
import history from '../extra/history';
import { Loading } from '../view/templates';

import OfficeList from './list'
import OfficeCreate from './create';
import OfficeAlter from './alter';


class Offices extends Component {
  displayName = Offices.name;

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить бюро",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true,
    }
    : {
      mode: "list",
      title: "список бюро",
      titleLink: "Создать",
      currentId: null,
      loading: true
    }


  componentDidMount = async () => {
    let errors = "";

    if (this.props.offices.length === 0)
      errors += await bring("office", this.props.fillOffices);

    if (this.props.users.length === 0)
      errors += await bring("user", this.props.fillUsers);

    !!errors && this.setState({ error: errors, loading: false });
    !!!errors && this.setState({ loading: false })
  }



  ///// RENDER
  render() {
    if (this.state.loading)
      return <Loading />

    let contents = [];

    if (this.state.mode === "list")
      contents = <OfficeList
        offices={this.props.offices}
        users={this.props.users}
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
        <a href="/office" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
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

    response.ok
      ? blink(`Бюро ${office.name} успешно изменено`)
      : response.json().then(error => blink(errorHandler(error), true));
  }



  linkToggle = async (e) => {
    e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать бюро" });
    else {
      history.push("/office");
      this.setState({ mode: "list", titleLink: "Создать", title: "список бюро" });
    }
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