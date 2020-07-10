let initialState = {
  depts: [],
  offices: [],
  users: [],
  labours: [],
  vacations: [],
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

    default: return state;
  }
}