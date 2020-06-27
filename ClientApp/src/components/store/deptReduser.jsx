let deptInitialState = {
  depts: [],
  users: [],
  title: "список отделов",
}


export let deptReducer = function (state = deptInitialState, action) {
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
        depts: action.depts
      };

    case "FILL_USERS":
      return {
        ...state,
        users: action.users
      };

    default: return deptInitialState;
  }
}