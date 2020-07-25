import React, { Component } from 'react';
import { DateGroup, OptionsInputGroup, CustomInputGroup } from '../view/templates';
import { keyGen, blink } from '../extra/extensions';
import { Route } from 'react-router-dom';


export default class LabourAlter extends Component {
  displayName = LabourAlter.name;

  managers = this.props.users.map(user =>
    <option key={user.id} value={user.id}>{user.fullName}</option>);

  options = this.props.users.filter(u => u.participateInLabour).map(user =>
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
    inputGroups: [...this.props.labour.userIds]
  }


  /////////// RENDER
  render() {
    let inputs = this.state.inputGroups.map(id =>
      <CustomInputGroup
        key={keyGen()}
        id={id}
        hint="Работник"
        name="Users[]"
        value={id}
        options={this.options}
        addInputGroup={this.addInputGroup}
        removeInputGroup={this.removeInputGroup}
      />);

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-6 pl-0" id="participants">
            <DateGroup name="Date" value={this.props.labour.date.slice(0, 10)} hint="Дата субботника" />
            <OptionsInputGroup
              reversed
              value={this.props.labour.managerId}
              name="ManagerId"
              options={this.managers}
              hint="Кто назначил" />
            {inputs}
          </div>

          <div className="mb-5 col-md-3 pl-0"><br /><hr />
            <Route render={({ history }) => (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  this.props.alterClick()
                    .then(result => {
                      result && history.push('/labour');
                    });
                }}
              >Изменить</button>
            )} />
          </div>
        </form >
      </div>
    );
  }

}
