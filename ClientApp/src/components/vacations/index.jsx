import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fillVacations, deleteVacation, addVacation, alterVacation } from '../redux/actions';
import { blink, errorHandler, bring, datesDiff } from '../extra/extensions';
import history from '../extra/history';
import { Loading } from '../view/templates';
import moment from 'moment';

import VacationList from './list';
import VacationCreate from './create';
import VacationAlter from './alter';


class Vacation extends Component {
  displayName = Vacation.name;

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить отпуск",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true,
    }

    : this.props.match.path === "/vacation/create"
      ? {
        mode: "create",
        title: "создать отпуск",
        titleLink: "Отмена",
        loading: true,
      }

      : {
        mode: "list",
        title: "список отпусков",
        titleLink: "Создать",
        currentId: null,
        loading: true,
      }


  componentDidMount = async () => {
    let request = [];

    if (this.props.vacations.length === 0)
      request.push("vacation");

    if (this.props.users.length === 0)
      request.push("user");

    if (this.props.depts.length === 0)
      request.push("department");

    if (this.props.offices.length === 0)
      request.push("office");

    if (request.length > 0) {
      let result = await bring(request)
        .catch(error => {
          this.setState({ error: error, loading: false })
          return;
        })

      await this.props.fillVacations({
        vacations: result.get("vacation"),
        users: result.get("user"),
        depts: result.get("department"),
        offices: result.get("office"),
      });
    }

    this.state.currentId
      ? this.setState({
        loading: false,
        vacation: Object.assign({}, this.props.vacations.find(v => v.id === this.state.currentId))
      })

      : this.setState({ loading: false });
  }


  ///// RENDER
  render() {
    if (this.state.loading)
      return <Loading />;

    else if (!!this.state.error)
      return <div className="text-danger font-italic">{this.state.error}</div>

    let contents = [];

    if (this.state.mode === "list")
      contents = <VacationList
        vacations={this.props.vacations}
        offices={this.props.offices}
        users={this.props.users}
        depts={this.props.depts}
        deleteVacation={this.props.deleteVacation}
      />

    else if (this.state.mode === "create")
      contents = <VacationCreate
        users={this.props.users}
        createVacation={this.createVacation}
      />

    else if (this.state.mode === "alter")
      contents = <VacationAlter
        vacation={this.state.vacation}
        users={this.props.users}
        alterVacation={this.alterVacation}
      />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/vacation" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  createVacation = (e) => {
    e && e.preventDefault();

    const form = document.forms["CreateForm"];
    const userId = +form.elements["userId"].value;
    const beginDate = form.elements["beginDate"].value;
    const endDate = form.elements["endDate"].value;

    const vacation = {
      userId: userId,
      beginDate: beginDate,
      endDate: endDate
    };

    try { this.isCorrectVacation(vacation) }
    catch (error) { blink(error, true); return; }

    fetch("api/vacation", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: userId,
        BeginDate: beginDate,
        EndDate: endDate
      })
    })
      .then(response => {
        response.json()
          .then(data => {
            if (response.ok) {
              this.props.addVacation({ id: +data, userId: userId, beginDate: beginDate, endDate: endDate })
              blink(`Отпуск успешно добавлен`)
                .then(this.linkToggle());
            }
            else blink(errorHandler(data), true);
          });
      });
  }

  isCorrectVacation = (vacation, alter = false) => {
    const begin = moment(vacation.beginDate);
    const end = moment(vacation.endDate);
    const vacationDays = datesDiff(begin, end) + 1;

    const user = this.props.users.find(u => u.id === vacation.userId);
    let daysTaken = this.props.vacations.filter(v => v.userId === user.id && moment(v.beginDate).year() === begin.year());

    let daysOccupied = 0;
    daysTaken instanceof Array
      ? alter
        ? daysTaken.filter(v => v.id !== vacation.id).forEach(dt => daysOccupied += datesDiff(dt.beginDate, dt.endDate) + 1)
        : daysTaken.forEach(dt => daysOccupied += datesDiff(dt.beginDate, dt.endDate) + 1)

      : daysOccupied = datesDiff(daysTaken.beginDate, daysTaken.endDate) + 1;

    if (daysOccupied >= 28)
      throw new Error("Нет доступных дней для отпуска в этом году");

    if (daysOccupied + vacationDays > 28)
      throw new Error(`Вам доступно только ${28 - daysOccupied} дней в этом году`);

    return true;
  }


  alterVacation = async () => {
    let vacation = Object.assign({}, this.props.vacations.find(d => d.id === this.state.currentId));
    const form = document.forms["CreateForm"];
    vacation.userId = +form.elements["userId"].value;
    vacation.beginDate = form.elements["beginDate"].value;
    vacation.endDate = form.elements["endDate"].value;

    try { this.isCorrectVacation(vacation, true) }
    catch (error) { throw error; }

    fetch(`api/vacation`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vacation)
    })
      .then(response =>
        response.ok
          ? blink(`Отпуск успешно изменен`)
            .then(this.props.alterVacation(vacation))

          : response.json()
            .then(error => blink(errorHandler(error), true))
      );

    return true;
  }


  linkToggle = async (e) => {
    e && e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать отпуск" });
    else {
      history.push("/vacation");
      this.setState({ mode: "list", titleLink: "Создать", title: "список отпусков" });
    }
  }

}

/////////// MAPPS
const chunkStateToProps = state => {
  return {
    vacations: state.vacations,
    users: state.users,
    depts: state.depts,
    offices: state.offices
  }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({
    fillVacations,
    alterVacation,
    addVacation,
    deleteVacation
  }, dispatch);


export default connect(chunkStateToProps, chunkDispatchToProps)(Vacation);