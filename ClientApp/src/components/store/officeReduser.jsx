let officeInitialState = {
  offices: [],
  users: [],
  title: "список бюро",
}


export let officeReducer = function (state = officeInitialState, action) {
  switch (action.type) {
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
        offices: action.offices
      };

    case "FILL_USERS":
      return {
        ...state,
        users: action.users
      };

    default: return officeInitialState;
  }
}