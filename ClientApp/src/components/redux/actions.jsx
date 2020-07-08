
export const addDept = dept => { return { type: "ADD_DEPT", dept }; }
export const deleteDept = id => { return { type: "DELETE_DEPT", id }; }
export const fillDepts = data => { return { type: "FILL_DEPTS", data }; }


export const addOffice = office => { return { type: "ADD_OFFICE", office }; }
export const deleteOffice = id => { return { type: "DELETE_OFFICE", id }; }
export const fillOffices = data => { return { type: "FILL_OFFICES", data }; }


export const addUser = user => { return { type: "ADD_USER", user }; }
export const deleteUser = id => { return { type: "DELETE_USER", id }; }
export const fillUsers = data => { return { type: "FILL_USERS", data }; }


export const addLabour = labour => { return { type: "ADD_LABOUR", labour }; }
export const deleteLabour = id => { return { type: "DELETE_LABOUR", id }; }
export const fillLabours = data => { return { type: "FILL_LABOURS", data }; }
export const alterLabour = labour => { return { type: "ALTER_LABOUR", labour }; }


export default {
    fillDepts, addDept, deleteDept,
    addOffice, deleteOffice, fillOffices,
    addUser, deleteUser, fillUsers,
    addLabour, deleteLabour, fillLabours, alterLabour
}