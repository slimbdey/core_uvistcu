let initialState = {
  depts: [],
  offices: [],
  users: [],
  labours: [],
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
        offices: [...state.offices, action.office]
      };

    case "DELETE_OFFICE":
      return {
        ...state,
        offices: state.offices.filter(o => o.id !== action.id)
      };

    case "FILL_OFFICES":
      return {
        ...state,
        offices: action.data.offices,
        users: action.data.users ? action.data.users : state.users,
      };

    /////////////////////////////// USERS ////////////////////////////      
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.user]
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.id)
      };

    case "FILL_USERS":
      return {
        ...state,
        offices: action.data.offices ? action.data.offices : state.offices,
        users: action.data.users,
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

    default: return state;
  }
}