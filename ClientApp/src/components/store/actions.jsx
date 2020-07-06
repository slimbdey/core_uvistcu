///////////////////// DEPARTMENT ///////////////////////////////
const addDept = dept => { return { type: "ADD_DEPT", dept }; }
const deleteDept = id => { return { type: "DELETE_DEPT", id }; }
const fillDepts = depts => { return { type: "FILL_DEPTS", depts }; }


///////////////////// OFFICE ///////////////////////////////
const addOffice = office => { return { type: "ADD_OFFICE", office }; }
const deleteOffice = id => { return { type: "DELETE_OFFICE", id }; }
const fillOffices = offices => { return { type: "FILL_OFFICES", offices }; }


///////////////////// USER ///////////////////////////////
const addUser = user => { return { type: "ADD_USER", user }; }
const deleteUser = id => { return { type: "DELETE_USER", id }; }
const fillUsers = users => { return { type: "FILL_USERS", users }; }


///////////////////// LABROUR ///////////////////////////////
const addLabour = labour => { return { type: "ADD_LABOUR", labour }; }
const deleteLabour = id => { return { type: "DELETE_LABOUR", id }; }
const fillLabours = labours => { return { type: "FILL_LABOURS", labours }; }
const alterLabour = labour => { return { type: "ALTER_LABOUR", labour }; }


export default {
    fillDepts, addDept, deleteDept,
    addOffice, deleteOffice, fillOffices,
    addUser, deleteUser, fillUsers,
    addLabour, deleteLabour, fillLabours, alterLabour
}