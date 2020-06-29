import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, log } from '../extra/extensions';
import actions from '../store/actions';

import { OfficeList } from './list.jsx'
import { OfficeCreate } from './create.jsx';
import { OfficeAlter } from './alter.jsx';


class Users extends Component {
  displayName = Offices.name;


  state = {
    mode: "list",
    linkText: "Создать",
    title: "список бюро",
    officeId: null
  }


  componentDidMount = async () => {
    //if (this.props.state.match.params.id) {
    //  this.alterClick(this.props.match.params.id);
    //  return;
    //}


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

    let u = bring("user");
    let o = bring("office");

    let errors = "";
    let responses = await Promise.all([u, o])
      .catch(error => {
        blink(`Error: ${error}`, true);
        return;
      });

    responses[0].ok
      ? users = await responses[0].json()
      : errors += "Пользователи не заведены\n";

    responses[1].ok
      ? offices = await responses[1].json()
      : errors += "Бюро отсутствуют";

    !!errors && blink(errors, true);

    this.props.fillOffices(users, offices);
  }



  ///// RENDER
  render() {
    let contents = [];

    if (this.state.mode === "list")
      contents = <OfficeList
        offices={this.props.offices}
        users={this.props.users}
        deleteOffice={this.props.deleteOffice}
        alterClick={this.alterClick}
        blink={blink} />

    else if (this.state.mode === "create")
      contents = <OfficeCreate
        users={this.props.users}
        addOffice={this.createOffice}
        blink={blink} />

    else if (this.state.mode === "alter")
      contents = <OfficeAlter
        state={this.props}
        offices={this.props.offices}
        officeId={this.state.officeId}
        alterClick={this.alterOffice}
        blink={blink} />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/office" className="text-primary" onClick={(e) => { e.preventDefault(); this.linkToggle(); }}>{this.state.linkText}</a>
        <div className="text-success" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }



  createOffice = async (e) => {
    e.preventDefault();

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

    let data = await response.json();
    if (response.ok) {
      this.props.addOffice({ id: data, name: name, chiefId: id });
      blink(`Бюро ${name} успешно добавлено`);
      this.linkToggle();
    }
    else
      blink(errorHandler(data), true);
  }


  alterOffice = async () => {
    let office = this.props.offices.find(o => o.id === this.state.officeId);
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
      this.setState({ mode: "list", linkText: "Создать", title: "список бюро" });
    }
    else {
      let data = await response.json();
      blink(errorHandler(data), true);
    }
  }


  alterClick = async (id) => {
    this.setState({ mode: "alter", linkText: "Назад", title: "изменить бюро", officeId: id });
  }


  linkToggle = async () => {
    if (this.state.mode === "list")
      this.setState({ mode: "create", linkText: "Назад", title: "создать бюро" });
    else
      this.setState({ mode: "list", linkText: "Создать", title: "список бюро" });
  }

}

/////////// MAP STATE
function mapStateToProps(state) {
  return {
    offices: state.officeReducer.offices,
    users: state.officeReducer.users,
    title: state.officeReducer.title,
  }
}

export default connect(mapStateToProps, actions)(Users);