import React, { Component } from 'react';
import { blink, errorHandler } from '../extra/extensions';
import '../view/fixedTable.css';
import { Labour } from './Labour';


const Filter = props => {
  return (
    <div className="input-group form-group">
      <div className="input-group-prepend">
        <button className="btn btn-outline-info" type="button"
          onClick={() => document.getElementsByName(props.name)[0].value = (new Date()).toISOString().slice(0, 10)}
        > Сегодня</button>
      </div>
      <input type="date" className="form-control date" name={props.name} defaultValue={props.value.slice(0, 10)} />
      <div className="input-group-append">
        <button className="btn btn-outline-success" type="button"
          onClick={() => props.set(document.getElementsByName(props.name)[0].value.slice(0, 10))}
        > Применить</button>
      </div>
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="button"
          onClick={() => props.reset()}
        > Сбросить</button>
      </div>
    </div>
  );
}



export default class LabourList extends Component {
  displayName = LabourList.name;

  state = {
    labours: this.props.labours
  }

  ///// RENDER
  render() {
    if (this.state.labours.length === 0)
      return <div></div>;

    return (
      <div>

        <div className="d-flex flex-row justify-content-between flex">
          <div className="col-md-6 pl-0">
            <Filter
              name="currentDate"
              value={new Date().toISOString()}
              set={this.filter}
              reset={this.resetFilter}
            />
          </div>
          <a href="/labour" onClick={(e) => this.props.priorityClick(e)}>Приоритет</a>
        </div>
        <table className='table table-sm table-hover mt-3 mytable' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th width="10%">Дата</th>
              <th>Руководитель</th>
              <th>Работники</th>
              <th width="15%"></th>
            </tr>
          </thead>
          <tbody style={{ maxHeight: "60vh" }}>
            {this.state.labours.map(labour =>
              <Labour
                key={labour.id}
                labour={labour}
                users={this.props.users}
                deleteClick={this.deleteClick}
              />)}
          </tbody>
        </table>
      </div>
    );
  }



  filter = date => {
    this.setState({
      labours: this.state.labours.filter(l => l.date.slice(0, 10) === date)
    });
  }

  resetFilter = () => {
    this.setState({
      labours: this.props.labours
    });
  }



  deleteClick = async id => {
    const response = await fetch(`api/labour/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      blink(`Субботник успешно удален`);
      this.props.deleteLabour(id);
      this.setState({ labours: this.props.labours });
    }
    else
      response.json()
        .then(error => blink(errorHandler(error), true));
  }

}