import React, { Component, PureComponent } from 'react';
import Modal from '../view/templates';
import { correctDate, blink, errorHandler } from '../extra/extensions';
import { Link } from 'react-router-dom';


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
        <span className="input-group-text">{props.hint}</span>
      </div>
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="button"
          onClick={() => props.reset()}
        > Сбросить</button>
      </div>
      <div className="input-group-append">
        <button className="btn btn-outline-success" type="button"
          onClick={() => props.set(document.getElementsByName(props.name)[0].value.slice(0, 10))}
        > Применить</button>
      </div>
    </div>
  );
}


class Labour extends PureComponent {
  labour = this.props.labour;
  manager = this.props.users.find(u => u.id === +this.labour.managerId);
  users = this.labour.userIds
    .map(uid =>
      <div key={uid}>
        <Link to={`/user/${uid}`} >{this.props.users.find(u => u.id === uid).fullName}</Link>
      </div>);

  render() {
    console.log("labour render");//////////////////////
    return (
      <tr key={this.props.id}>
        <td>{correctDate(this.labour.date)}</td>
        <td><Link to={`/user/${this.manager.id}`}>{this.manager.fullName}</Link></td>
        <td>{this.users}</td>
        <td>
          <div className="d-flex">
            <Modal
              buttonLabel="Удалить"
              text="Вы действительно хотите удалить субботник?"
              func={() => this.props.deleteClick(this.labour.id)} />
          </div>
        </td>
      </tr>
    );
  }
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
        <div className="col-md-6 pl-0">
          <Filter
            name="currentDate"
            value={new Date().toISOString()}
            hint="Фильтр"
            set={this.filter}
            reset={this.resetFilter}
          />
        </div>
        <table className='table table-sm table-hover mt-3' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Дата</th>
              <th width="35%">Руководитель</th>
              <th>Работники</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
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