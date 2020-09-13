import moment from "moment";

let initialState = {
  user: null,
  role: null,
  depts: [],
  offices: [],
  users: [],
  labours: [],
  vacations: [],
  overtimes: [],
  currentDeptId: 1,
  voterId: null,
  maxYear: null,
};

export let reducer = function (state = initialState, action) {
  switch (action.type) {
    /////////////////////////////// DEPTS ////////////////////////////
    case "ADD_DEPT":
      return {
        ...state,
        depts: [...state.depts, action.dept],
      };

    case "DELETE_DEPT":
      return {
        ...state,
        depts: state.depts.filter((d) => d.id !== action.id),
      };

    case "ALTER_DEPT":
      return {
        ...state,
        depts: state.depts.map((d) =>
          d.id === action.dept.id ? action.dept : d
        ),
      };

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
        offices: [...state.offices, action.office].sort(
          (a, b) => a.name > b.name
        ),
      };

    case "DELETE_OFFICE":
      return {
        ...state,
        offices: state.offices
          .filter((o) => o.id !== action.id)
          .sort((a, b) => a.name > b.name),
      };

    case "ALTER_OFFICE":
      return {
        ...state,
        offices: state.offices
          .map((o) => (o.id === action.office.id ? action.office : o))
          .sort((a, b) => a.name > b.name),
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
        users: [...state.users, action.user].sort(
          (a, b) => a.fullName > b.fullName
        ),
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.id),
      };

    case "ALTER_USER":
      return {
        ...state,
        users: state.users
          .map((u) => (+u.id === +action.user.id ? action.user : u))
          .sort((a, b) => a.fullName > b.fullName),
      };

    case "FILL_USERS":
      return {
        ...state,
        depts: action.data.depts || state.depts,
        offices: action.data.offices || state.offices,
        users: (action.data.users || state.users).sort((a, b) => a.fullName > b.fullName),
      };

    /////////////////////////////// LABOURS ////////////////////////////
    case "ADD_LABOUR":
      return {
        ...state,
        labours: [...state.labours, action.labour].sort(
          (a, b) => a.date < b.date
        ),
      };

    case "DELETE_LABOUR":
      return {
        ...state,
        labours: state.labours
          .filter((l) => l.id !== action.id)
          .sort((a, b) => a.date < b.date),
      };

    case "FILL_LABOURS":
      return {
        ...state,
        users: action.data.users ? action.data.users : state.users,
        labours: action.data.labours.sort((a, b) => a.date < b.date),
      };

    case "ALTER_LABOUR":
      return {
        ...state,
        labours: state.labours
          .map((lab) => (lab.id === action.labour.id ? action.labour : lab))
          .sort((a, b) => a.date < b.date),
      };

    /////////////////////////////// OVERTIMES ////////////////////////////
    case "ADD_OVERTIME":
      return {
        ...state,
        overtimes: [...state.overtimes, action.overtime].sort(
          (a, b) => a.date < b.date
        ),
      };

    case "DELETE_OVERTIME":
      return {
        ...state,
        overtimes: state.overtimes
          .filter((o) => o.id !== action.id)
          .sort((a, b) => a.date < b.date),
      };

    case "FILL_OVERTIMES":
      return {
        ...state,
        users: action.data.users ? action.data.users : state.users,
        overtimes: action.data.overtimes.sort((a, b) => a.date < b.date),
        depts: action.data.depts ? action.data.depts : state.depts,
        offices: action.data.offices ? action.data.offices : state.offices,
      };

    case "ALTER_OVERTIME":
      return {
        ...state,
        overtimes: state.overtimes
          .map((ov) => (ov.id === action.overtime.id ? action.overtime : ov))
          .sort((a, b) => a.date < b.date),
      };

    /////////////////////////////// VACATIONS ////////////////////////////
    case "ADD_VACATION":
      return {
        ...state,
        vacations: [...state.vacations, action.vacation],
      };

    case "DELETE_VACATION":
      return {
        ...state,
        vacations: state.vacations.filter((v) => v.id !== action.id),
      };

    case "ALTER_VACATION":
      return {
        ...state,
        vacations: state.vacations.map((v) =>
          v.id === action.vacation.id ? action.vacation : v
        ),
      };

    case "FILL_VACATIONS":
      return {
        ...state,
        users: action.data.users || state.users,
        depts: action.data.depts || state.depts,
        offices: action.data.offices || state.offices,
        vacations: action.data.vacations,
      };

    /////////////////////////////// GENERAL APPLICATION STATE ////////////////////////////
    case "SET_CURRENT_DEPT":
      return {
        ...state,
        currentDeptId: action.deptId,
      };

    case "FIND_DEPT_VOTER":
      let deptUsersToVote = [];
      deptUsersToVote.push(
        ...state.users.filter((u) => u.deptId === action.deptId)
      );

      const dOffices = state.offices.filter((o) => o.deptId === action.deptId);
      if (dOffices.length > 0)
        deptUsersToVote.push(
          ...state.users.filter((u) =>
            dOffices.some((of) => u.officeId === of.id)
          )
        );

      const headManager = state.users.find(
        (u) => u.fullName === window.headManager
      );
      if (headManager) {
        if (action.deptId === 1 && headManager.vacationRating)
          deptUsersToVote.push(headManager);
      }

      deptUsersToVote = deptUsersToVote.filter((user) => user.vacationRating);

      let min =
        deptUsersToVote.length > 0
          ? Math.min(...deptUsersToVote.map((du) => du.vacationRating))
          : null;

      return {
        ...state,
        voterId: min
          ? deptUsersToVote.find((u) => u.vacationRating === min).id
          : null,
      };

    case "GET_DEPT_VACATIONS_MAX_YEAR":
      let deptUsers = [];
      deptUsers.push(...state.users.filter((u) => u.deptId === action.deptId));

      const deptOffices = state.offices.filter(
        (o) => o.deptId === action.deptId
      );
      if (deptOffices.length > 0)
        deptUsers.push(
          ...state.users.filter((u) =>
            deptOffices.some((of) => u.officeId === of.id)
          )
        );

      const Telichko = state.users.find(
        (u) => u.fullName === window.headManager
      );

      if (action.deptId === 1 && Telichko) deptUsers.push(Telichko);

      const deptVacations = state.vacations.filter((v) =>
        deptUsers.some((du) => v.userId === du.id)
      );

      return {
        ...state,
        maxYear: Math.max(
          ...deptVacations.map((v) => moment(v.beginDate).year())
        ),
      };

    /////////////////////////////// CUSTOM //////////////////////////////////
    case "SET_BACK_LINK":
      return {
        ...state,
        backLink: action.link,
      };

    /////////////////////////////// AUTHENTICATE ////////////////////////////
    case "AUTHENTICATE":
      return {
        ...state,
        user: action.data.user,
        role: action.data.role,
      };

    default:
      return state;
  }
};
