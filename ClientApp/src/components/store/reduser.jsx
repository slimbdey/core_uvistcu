let initialState = {
  depts: [],
  offices: [],
  users: [],
  labours: [],
}


export let reducer = function (state = initialState, action) {
  switch (action.type) {
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
        depts: action.depts,
      };

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
        offices: action.offices,
      };

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
        users: action.users,
      };

    case "ADD_LABOUR":
      return {
        ...state,
        labours: [...state.labours, action.labour]
      };

    case "DELETE_LABOUR":
      return {
        ...state,
        labours: state.labours.filter(l => l.id !== action.id)
      };

    case "FILL_LABOURS":
      return {
        ...state,
        labours: action.labours
      };

    default: return state;
  }
}