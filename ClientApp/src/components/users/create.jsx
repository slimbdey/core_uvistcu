import React, { Component } from 'react';
import { InputGroup } from '../view/templates';


export default class OfficeCreate extends Component {

  /////// RENDER
  render() {

    return (
      <div className="mt-3">
        <form name="CreateForm">
          <button type="submit" disabled style={{ display: 'none' }} ></button>

          <div className="col-md-5 pl-0">
            <InputGroup name="FullName" value="" hint="Ф.И.О." reversed />
            <InputGroup name="TabNum" value="" hint="Таб. №" reversed />
          </div>

          <div className="col-md-3 mt-5 pl-0">
            <hr />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.props.createUser}
            >Создать</button>
          </div>
        </form >
      </div >
    );
  }

}