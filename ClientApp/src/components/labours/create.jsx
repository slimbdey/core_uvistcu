import React, { Component } from 'react';
import { DateGroup, OptionsInputGroup, CustomInputGroup } from '../view/templates';
import { keyGen, blink } from '../extra/extensions';


export default class LabourCreate extends Component {

  options = this.props.users.map(user =>
    <option
      key={user.id}
      value={user.id}
      onClick={e => {
        let oldId = +e.target.parentNode.parentNode.id;
        let newId = +e.target.value;

        if (this.state.inputGroups.includes(newId) && newId !== oldId) {
          blink("Этот пользователь уже есть в списке!", true);
          e.target.parentNode[oldId - 1].selected = true;
        }

        else
          this.setState({
            inputGroups: this.state.inputGroups.map(ig =>
              ig === oldId
                ? newId
                : ig
            )
          })
      }}
    > {user.fullName}</option >);

  counter = 0;

  addInputGroup = () => {
    this.counter = Math.max(...this.state.inputGroups) + 1;
    this.setState({ inputGroups: [...this.state.inputGroups, +this.counter] });
  }

  removeInputGroup = id => {
    this.state.inputGroups.length > 1 && this.setState({ inputGroups: this.state.inputGroups.filter(i => i !== id) })
  }

  state = {
    inputGroups: [++this.counter]
  }


  /////// RENDER
  render() {
    let inputs = this.state.inputGroups.map(i =>
      <CustomInputGroup
        key={keyGen()}
        id={i}
        hint="Работник"
        name="Users[]"
        value={i}
        options={this.options}
        addInputGroup={this.addInputGroup}
        removeInputGroup={this.removeInputGroup}
      />);

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0" id="participants">
            <DateGroup name="Date" value={(new Date()).toISOString().slice(0, 10)} hint="Дата субботника" />
            <OptionsInputGroup reversed name="ManagerId" options={this.options} hint="Кто назначил" />
            {inputs}
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

