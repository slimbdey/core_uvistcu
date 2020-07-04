import React, { Component } from 'react';
import { DateGroup } from '../view/templates';


class LabourInputGroup extends Component {
  id = this.props.id;

  render() {
    return (
      <div className="form-group input-group" id={this.id}>
        <div className="input-group-prepend">
          <button type="button" className="btn btn-outline-danger" onClick={() => this.props.removeInputGroup(this.id)}>-</button>
        </div>
        <select className="custom-select" name="Users">{this.props.options}</select>
        <div className="input-group-append">
          <span className="input-group-text">Работник</span>
          <button type="button" className="btn btn-outline-success" onClick={this.props.addInputGroup}>+</button>
        </div>
      </div>
    );
  }
}


export default class LabourCreate extends Component {

  options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);
  counter = 0;

  addInputGroup = () => {
    let id = ++this.counter;

    this.setState(old => {
      return {
        inputGroups: [...old.inputGroups,
        <LabourInputGroup
          id={id}
          key={Math.random() * 1000}
          options={this.options}
          addInputGroup={this.addInputGroup}
          removeInputGroup={this.removeInputGroup}
        />],
        ids: [...old.ids, id]
      }
    });

  }

  removeInputGroup = (id) => {
    id > 1 && document.getElementById(id).remove();
  }

  state = {
    inputGroups: [
      <LabourInputGroup
        id={++this.counter}
        key={Math.random() * 1000}
        options={this.options}
        addInputGroup={this.addInputGroup}
        removeInputGroup={this.removeInputGroup}
      />
    ],
    ids: []
  }


  /////// RENDER
  render() {
    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0" id="participants">
            <DateGroup name="Date" value={(new Date()).toISOString().slice(0, 10)} hint="Дата субботника" />

            <div className="form-group input-group">
              <select className="custom-select" name="ManagerId">{this.options}</select>
              <div className="input-group-append">
                <span className="input-group-text">Кто назначил</span>
              </div>
            </div>
            {this.state.inputGroups}
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.props.createLabour}
            >Создать</button>
          </div>
        </form >
      </div>
    );
  }

}

