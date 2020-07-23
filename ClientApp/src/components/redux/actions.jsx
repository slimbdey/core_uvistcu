
export const addDept = dept => { return { type: "ADD_DEPT", dept }; }
export const deleteDept = id => { return { type: "DELETE_DEPT", id }; }
export const alterDept = dept => { return { type: "ALTER_DEPT", dept }; }
export const fillDepts = data => { return { type: "FILL_DEPTS", data }; }


export const addOffice = office => { return { type: "ADD_OFFICE", office }; }
export const deleteOffice = id => { return { type: "DELETE_OFFICE", id }; }
export const alterOffice = office => { return { type: "ALTER_OFFICE", office }; }
export const fillOffices = data => { return { type: "FILL_OFFICES", data }; }


export const addUser = user => { return { type: "ADD_USER", user }; }
export const alterUser = user => { return { type: "ALTER_USER", user }; }
export const deleteUser = id => { return { type: "DELETE_USER", id }; }
export const fillUsers = data => { return { type: "FILL_USERS", data }; }


export const addLabour = labour => { return { type: "ADD_LABOUR", labour }; }
export const deleteLabour = id => { return { type: "DELETE_LABOUR", id }; }
export const fillLabours = data => { return { type: "FILL_LABOURS", data }; }
export const alterLabour = labour => { return { type: "ALTER_LABOUR", labour }; }


export const addVacation = vacation => { return { type: "ADD_VACATION", vacation }; }
export const alterVacation = vacation => { return { type: "ALTER_VACATION", vacation }; }
export const deleteVacation = id => { return { type: "DELETE_VACATION", id }; }
export const fillVacations = data => {
  return dispatch => {
    dispatch({ type: "FILL_VACATIONS", data });
    dispatch(findDeptVoter(data.depts[0].id));
    dispatch(getDeptVacationsMaxYear(data.depts[0].id));
  }
}


export const setCurrentDept = deptId => {
  return dispatch => {
    dispatch({ type: "SET_CURRENT_DEPT", deptId });
    dispatch(findDeptVoter(deptId));
    dispatch(getDeptVacationsMaxYear(deptId));
  }
}
export const findDeptVoter = deptId => { return { type: "FIND_DEPT_VOTER", deptId } };
export const getDeptVacationsMaxYear = deptId => { return { type: "GET_DEPT_VACATIONS_MAX_YEAR", deptId } };