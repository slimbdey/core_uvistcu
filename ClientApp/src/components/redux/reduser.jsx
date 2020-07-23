import moment from 'moment';


let initialState = {
  depts: [],
  offices: [],
  users: [],
  labours: [],
  vacations: [],
  currentDeptId: 1,
  voterId: null,
  maxYear: null,
}


export let reducer = function (state = initialState, action) {
  switch (action.type) {

    /////////////////////////////// DEPTS ////////////////////////////
    case "ADD_DEPT":
      return {
        ...state,
        depts: [...state.depts, action.dept]
      };

    case "DELETE_DEPT":
      return {
        ...state,
        depts: state.depts.filter(d => d.id !== action.id)
      };

    case "ALTER_DEPT":
      return {
        ...state,
        depts: state.depts.map(d => d.id === action.dept.id ? action.dept : d)
      }

    case "FILL_DEPTS":
      return {
        ...state,
        depts: action.data.depts,
        offices: action.data.offices ? action.data.offices : state.offices,
        users: action.data.users ? action.data.users : state.users,
      };

    /////////////////////////////// OFFICES ////////////////////////////      
    case "ADD_OFFICE":
      return {
        ...state,
        offices: [...state.offices, action.office].sort((a, b) => a.name > b.name)
      };

    case "DELETE_OFFICE":
      return {
        ...state,
        offices: state.offices.filter(o => o.id !== action.id).sort((a, b) => a.name > b.name)
      };

    case "ALTER_OFFICE":
      return {
        ...state,
        offices: state.offices.map(o => o.id === action.office.id ? action.office : o).sort((a, b) => a.name > b.name)
      };

    case "FILL_OFFICES":
      return {
        ...state,
        offices: action.data.offices.sort((a, b) => a.name > b.name),
        users: action.data.users ? action.data.users : state.users,
      };

    /////////////////////////////// USERS ////////////////////////////      
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.user].sort((a, b) => a.fullName > b.fullName)
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.id)
      };

    case "ALTER_USER":
      return {
        ...state,
        users: state.users.map(u => +u.id === +action.user.id ? action.user : u).sort((a, b) => a.fullName > b.fullName)
      };

    case "FILL_USERS":
      return {
        ...state,
        offices: action.data.offices ? action.data.offices : state.offices,
        users: action.data.users.sort((a, b) => a.fullName > b.fullName),
      };

    /////////////////////////////// LABOURS ////////////////////////////      
    case "ADD_LABOUR":
      return {
        ...state,
        labours: [...state.labours, action.labour].sort((a, b) => a.date < b.date)
      };

    case "DELETE_LABOUR":
      return {
        ...state,
        labours: state.labours.filter(l => l.id !== action.id).sort((a, b) => a.date < b.date)
      };

    case "FILL_LABOURS":
      return {
        ...state,
        users: action.data.users ? action.data.users : state.users,
        labours: action.data.labours.sort((a, b) => a.date < b.date)
      };

    case "ALTER_LABOUR":
      return {
        ...state,
        labours: state.labours
          .map(lab => lab.id === action.labour.id ? action.labour : lab)
          .sort((a, b) => a.date < b.date)
      };

    /////////////////////////////// VACATIONS ////////////////////////////      
    case "ADD_VACATION":

      return {
        ...state,
        vacations: [...state.vacations, action.vacation]
      };

    case "DELETE_VACATION":
      return {
        ...state,
        vacations: state.vacations.filter(v => v.id !== action.id)
      };

    case "ALTER_VACATION":
      return {
        ...state,
        vacations: state.vacations.map(v => v.id === action.vacation.id ? action.vacation : v)
      };

    case "FILL_VACATIONS":
      return {
        ...state,
        users: action.data.users ? [...action.data.users] : state.users,
        depts: action.data.depts ? [...action.data.depts] : state.depts,
        offices: action.data.offices ? [...action.data.offices] : state.offices,
        vacations: [...action.data.vacations]
      };


    /////////////////////////////// GENERAL APPLICATION STATE ////////////////////////////
    case "SET_CURRENT_DEPT":
      return {
        ...state,
        currentDeptId: action.deptId
      };

    case "FIND_DEPT_VOTER":
      let deptUsersToVote = state.users.filter(u => state.offices.filter(o => o.deptId === action.deptId).some(of => u.officeId === of.id))
        .filter(user => user.vacationRating);

      const deptManagerId = state.depts.find(d => d.id === action.deptId).managerId;
      const deptManager = state.users.find(u => u.id === deptManagerId);
      deptManager.vacationRating && deptUsersToVote.push(deptManager);

      const headManager = state.users.find(u => u.fullName === "Теличко Константин Сергеевич");
      if (action.deptId === 1 && headManager.vacationRating)
        deptUsersToVote.push(headManager);

      return {
        ...state,
        voterId: deptUsersToVote.length > 0
          ? deptUsersToVote.sort((a, b) => a.vacationRating > b.vacationRating)[0].id
          : null
      };

    case "GET_DEPT_VACATIONS_MAX_YEAR":
      const deptOffices = state.offices.filter(o => o.deptId === action.deptId);
      let deptUsers = state.users.filter(u => deptOffices.some(of => u.officeId === of.id));

      const dManagerId = state.depts.find(d => d.id === action.deptId).managerId;
      const dManager = state.users.find(u => u.id === dManagerId);
      deptUsers.push(dManager);

      const Telichko = state.users.find(u => u.fullName === "Теличко Константин Сергеевич");
      if (action.deptId === 1)
        deptUsers.push(Telichko);

      const deptVacations = state.vacations.filter(v => deptUsers.some(du => v.userId === du.id))

      return {
        ...state,
        maxYear: Math.max(...deptVacations.map(v => moment(v.beginDate).year()))
      };

    default: return state;
  }
}