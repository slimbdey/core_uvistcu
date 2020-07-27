import React, { Component } from 'react';
import { InputGroup, OptionsInputGroup } from '../view/templates';


export default class DepartmentCreate extends Component {

  /////// RENDER
  render() {
    let options = this.props.users.map(user => <option key={user.id} value={user.id}>{user.fullName}</option>);

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-5 pl-0">
            <InputGroup reversed hint="Наименование" name="Name" />
            <OptionsInputGroup reversed hint="Руководитель" name="ChiefId" options={options} />
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.props.createDept}
            >Создать</button>
          </div>
        </form >
      </div >
    );
  }

}

