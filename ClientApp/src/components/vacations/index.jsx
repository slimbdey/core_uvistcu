import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { fillVacations, deleteVacation, addVacation, alterVacation, setCurrentDept, findDeptVoter, getDeptVacationsMaxYear, setBackLink } from '../redux/actions';
import { blink, errorHandler, bring, datesDiff, calculateRating } from '../extra/extensions';
import history from '../extra/history';
import { Loading } from '../view/templates';
import moment from 'moment';


import VacationList from './list';
import VacationCreate from './create';
import VacationAlter from './alter';
import VacationVoting from './voting';


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

      : this.props.match.path === "/vacation/list"
        ? {
          mode: "list",
          title: "список отпусков",
          titleLink: "Создать",
          currentId: null,
          loading: true,
        }

        : {
          mode: "voting",
          title: "распределение отпусков",
          titleLink: "Список",
          loading: true,
          calculating: false,
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
        title: `распределение отпусков ${this.props.maxYear}`,
        vacation: Object.assign({}, this.props.vacations.find(v => v.id === this.state.currentId))
      })

      : this.setState({
        loading: false,
        title: `распределение отпусков ${this.props.maxYear}`,
      });
  }


  ////////////////// RENDER
  render() {

    if (this.state.loading)
      return <Loading />;

    if (!!this.state.error)
      return <div className="text-danger font-italic">{this.state.error}</div>

    let contents = [];

    if (this.state.mode === "list")
      contents = <VacationList
        vacations={this.props.vacations}
        offices={this.props.offices}
        users={this.props.users}
        depts={this.props.depts}
        deleteVacation={this.props.deleteVacation}
        getMaxYear={this.props.getDeptVacationsMaxYear}
        currentDeptId={this.props.currentDeptId}
      />

    else if (this.state.mode === "create")
      contents = <VacationCreate
        users={this.props.users}
        createVacation={this.createVacation}
        voterId={this.props.voterId}
        role={this.props.role}
      />

    else if (this.state.mode === "alter")
      contents = <VacationAlter
        vacation={this.state.vacation}
        users={this.props.users}
        alterVacation={this.alterVacation}
      />

    else contents =
      <VacationVoting
        vacations={this.props.vacations.filter(v => moment(v.beginDate).year() === this.props.maxYear)}
        users={this.props.users}
        offices={this.props.offices}
        depts={this.props.depts}
        deptId={this.props.currentDeptId}
      />


    let redButton = this.state.calculating
      ? <img alt="calculating..." src="calculating.gif" height={30} />
      : <span
        id="redButton"
        className={this.props.voterId ? "text-danger" : "text-success blink_me"}
        style={{ cursor: "pointer" }}
        onClick={this.toggleVoting}
      >{this.props.voterId ? "Остановить" : "Запустить"}</span>


    let breadcrumbs =
      <div className="d-flex flex-row justify-content-end">
        {this.state.mode === "list" &&
          <Fragment>
            <Link className="text-primary" to="/vacation">Распределение</Link>
            <div>&nbsp;&nbsp;&nbsp;</div>
          </Fragment>}
        {this.props.role.id > 1 && <a href="/vacation" className="text-primary mb-2" onClick={this.linkToggle}>{this.state.titleLink}</a>}
        <div className="flex-grow-1"></div>
        {this.state.mode === "voting" &&
          <Fragment>
            {this.props.voterId && this.props.voterId === this.props.user.id &&
              <Fragment>
                <a href="/vacation/create" onClick={e => this.vote(e)}>Проголосовать</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Fragment>}
            <span
              className={this.props.voterId ? "text-info text-right mr-4" : "text-secondary text-right mr-4"}
            >{this.props.voterId ? `Идет процесс голосования. Голосует ${this.props.users.find(u => u.id === this.props.voterId).fullName}` : "Процесс голосования не начат"}</span>
            {this.props.role.id > 1 && redButton}
          </Fragment>
        }
      </div>

    return (
      <div>
        <div className="display-5 text-uppercase text-muted">{this.state.title}</div>
        {breadcrumbs}
        <div className="d-flex flex-row justify-content-between">
          <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
          {this.state.mode === "voting" &&
            <div className="col-md-4 pr-0">
              <div className="form-group input-group input-group-sm">
                <select
                  id="dept"
                  className="custom-select custom-select-sm"
                  defaultValue={this.props.currentDeptId}
                  onChange={e => this.props.setCurrentDept(+document.getElementById("dept").value)}
                >{this.props.depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <div className="input-group-append">
                  <span className="input-group-text">Отдел</span>
                </div>
              </div>
            </div>}
        </div>
        {contents}
      </div>
    );
  }


  vote = e => {
    e && e.preventDefault();
    this.props.setBackLink("/vacation");
    history.push("/vacation/create");
  }


  createVacation = (e) => {
    e && e.preventDefault();

    const form = document.forms["CreateForm"];
    const userId = +form.elements["userId"].value;
    const beginDate = form.elements["beginDate"].value;
    const range = +document.getElementById("range").value;
    const endDate = moment(beginDate).add(range - 1, 'days').format("YYYY-MM-DD");

    const vacation = {
      userId: userId,
      beginDate: beginDate,
      endDate: endDate
    };

    try { this.isCorrectVacation(vacation) }
    catch (error) { blink(error, true); return; }

    /////////////////////////////////////////////////// SWITCH VOTER
    let user = this.props.users.find(u => u.id === userId);
    let deptId = user.deptId;

    if (!deptId) {
      if (user.fullName === "Теличко Константин Сергеевич")
        deptId = 1

      //else if (this.props.depts.some(d => d.managerId === user.id))
      //  deptId = this.props.depts.find(dep => dep.managerId === user.id).id;

      else
        deptId = this.props.offices.find(o => o.id === user.officeId).deptId;
    }

    this.props.setCurrentDept(deptId);

    if (this.props.voterId) {
      const switchVoter = () => {
        user.vacationRating = null;

        fetch(`api/user`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user)
        });
      }

      const cDuration = datesDiff(vacation.beginDate, vacation.endDate) + 1;
      if (cDuration === 28)
        switchVoter();

      else {
        const year = moment(vacation.beginDate).year();
        const userVacations = this.props.vacations.filter(v => moment(v.beginDate).year() === year && v.userId === user.id);
        if (userVacations.length > 0) {
          const tDuration = userVacations.reduce((sum, cur) => sum += datesDiff(cur.beginDate, cur.endDate) + 1, 0);
          if (tDuration + cDuration === 28)
            switchVoter();
        }
      }
    }
    ////////////////////////////////////////////////////////

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
              this.props.addVacation({ id: +data, userId: userId, beginDate: beginDate, endDate: endDate });
              this.props.findDeptVoter(this.props.currentDeptId);
              this.props.getDeptVacationsMaxYear(this.props.currentDeptId);
              blink(`Отпуск успешно добавлен`)
                .then(this.props.backLink
                  ? history.push(this.props.backLink)
                  : this.linkToggle());
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

    if (this.state.mode === "voting") {
      history.push("/vacation/list");
    }

    else if (this.state.mode === "list")
      history.push("/vacation/create");

    else if (this.state.mode === "create" || this.state.mode === "alter")
      history.push("/vacation/list");

  }


  componentDidUpdate(oldProps) {
    oldProps.maxYear !== this.props.maxYear && this.setState({ title: `распределение отпусков ${this.props.maxYear}` });
  }


  toggleVoting = () => {
    this.setState({ calculating: true });

    let deptPeople = [];
    deptPeople.push(...this.props.users.filter(u => u.deptId === this.props.currentDeptId));

    const deptOffices = this.props.offices.filter(o => o.deptId === this.props.currentDeptId);
    if (deptOffices.length > 0)
      deptPeople.push(...this.props.users.filter(u => deptOffices.some(o => u.officeId === o.id)));

    const headManager = this.props.users.find(u => u.fullName === "Теличко Константин Сергеевич");
    if (this.props.currentDeptId === 1)
      deptPeople = [...deptPeople, headManager];

    let deptVacations = this.props.vacations.slice().filter(v => deptPeople.some(usr => v.userId === usr.id));

    let maxVacationYear = Math.max(...deptVacations.map(dv => moment(dv.beginDate).year()));
    let last3Years = [maxVacationYear, maxVacationYear - 1, maxVacationYear - 2];
    deptVacations = deptVacations.filter(dvac => last3Years.some(yr => moment(dvac.beginDate).year() === yr));

    /////// CANCEL VOTING
    if (this.props.voterId) {
      if (!window.confirm("Вы уверены в том, что хотите отменить голосование?\nВесь прогресс заполнения отпусков будет обнулен")) {
        this.setState({ calculating: false });
        return;
      }

      let peopleToVote = deptPeople.slice().filter(dp => dp.vacationRating !== null);
      peopleToVote.forEach(u => u.vacationRating = null);

      let tasks = peopleToVote.map(vp =>
        fetch(`api/user`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vp)
        }));


      let vacsToDelete = deptVacations.filter(va => !va.score); // у новых отпусков отдела нет очков!
      if (vacsToDelete.length > 0) {
        const extraTasks = vacsToDelete
          .map(vac =>
            fetch(`api/vacation/${vac.id}`, {
              method: "DELETE",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
              }
            }));

        tasks = [...tasks, ...extraTasks];
      }

      Promise.all(tasks)
        .then(responses => {
          responses.filter(r => !r.ok).length > 0
            ? blink(`Ошибка: не могу отменить голосование`, true)
            : blink(`Голосование отменено`)
              .then(vacsToDelete.forEach(v => this.props.deleteVacation(v.id)))
              .then(this.props.setCurrentDept(this.props.currentDeptId))
              .then(this.setState({ calculating: false }))
        });
    }
    ////// START VOTING
    else {
      calculateRating(deptPeople, deptVacations, this.props.maxYear);

      let vTasks = deptVacations.map(dv =>
        fetch(`api/vacation`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dv)
        }));

      let pTasks = deptPeople.map(dp =>
        fetch(`api/user`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dp)
        }));

      const tasks = [...vTasks, ...pTasks];

      Promise.all(tasks)
        .then(responses => {
          responses.filter(r => !r.ok).length > 0
            ? blink(`Ошибка: не могу запустить голосование`, true)
            : blink(`Голосование запущено`)
              .then(this.props.findDeptVoter(this.props.currentDeptId))
              .then(this.setState({ calculating: false }))
        });
    }
  }

}


/////////// MAPPS
const chunkStateToProps = state => {
  return {
    vacations: state.vacations,
    users: state.users,
    depts: state.depts,
    offices: state.offices,
    currentDeptId: state.currentDeptId,
    voterId: state.voterId,
    maxYear: state.maxYear,
    user: state.user,
    role: state.role,
    backLink: state.backLink,
  }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({
    fillVacations,
    alterVacation,
    addVacation,
    deleteVacation,
    setCurrentDept,
    findDeptVoter,
    getDeptVacationsMaxYear,
    setBackLink
  }, dispatch);


export default connect(chunkStateToProps, chunkDispatchToProps)(Vacation);