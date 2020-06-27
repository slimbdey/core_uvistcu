import React, { Component } from 'react';
import { connect } from 'react-redux';
import { errorHandler } from '../extra/errorHandler';
import { blink } from '../extra/blink';
import actions from '../store/actions';

import { OfficeList } from './list'
import { OfficeCreate } from './create';
import { OfficeDetails } from './details';


class Offices extends Component {
  static displayName = Offices.name;


  state = {
    mode: "list",
    linkText: "Создать",
    title: "список бюро"
  }


  componentDidMount = async () => {
    if (this.props.offices.length === 0)
      this.getOffices();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.users.length === 0)
      this.getUsers();
  }


  ///// RENDER
  render() {
    let contents = [];
    console.log("offices-render", this.props);
    if (this.state.mode === "list")
      contents = <OfficeList offices={this.props.offices} users={this.props.users} deleteOffice={this.props.deleteOffice} blink={blink} />

    else if (this.state.mode === "create")
      contents = <OfficeCreate users={this.props.users} blink={blink} addOffice={this.createOffice} />

    else if (this.state.mode === "details")
      contents = <OfficeDetails offices={this.props.offices} fillOffices={this.props.fillOffices} blink={blink} />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/office" className="text-primary" onClick={(e) => { e.preventDefault(); this.linkToggle(); }}>{this.state.linkText}</a>
        <div className="text-success" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  getOffices = async () => {
    const response = await fetch('api/office', {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0)
        this.props.fillOffices(data);

      else
        blink("Бюро отсутствуют", true);
    }
    else
      blink(`Error: ${response.statusText}`, true);

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
        ChiefId: id
      })
    });

    let data = await response.json();
    if (response.ok) {
      this.props.addOffice({ id: data, name: name, chiefId: id });
      blink(`Бюро ${data.name} успешно добавлено`);
      this.linkToggle();
    }
    else
      blink(errorHandler(data), true);
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

export default connect(mapStateToProps, actions)(Offices);