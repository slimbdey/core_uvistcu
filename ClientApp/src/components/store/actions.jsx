///////////////////// DEPARTMENT ///////////////////////////////
let addDept = function (dept) {
    return {
        type: "ADD_DEPT",
        dept
    }
};

let deleteDept = function (id) {
    return {
        type: "DELETE_DEPT",
        id
    }
};

let fillDepts = function (depts, users, offices) {
    return {
        type: "FILL_DEPTS",
        depts,
        users,
        offices
    }
}

///////////////////// OFFICE ///////////////////////////////
let addOffice = function (office) {
    return {
        type: "ADD_OFFICE",
        office
    }
};

let deleteOffice = function (id) {
    return {
        type: "DELETE_OFFICE",
        id
    }
};

let fillOffices = function (offices) {
    return {
        type: "FILL_OFFICES",
        offices
    }
}

let fillUsers = function (users) {
    return {
        type: "FILL_USERS",
        users
    }
}


export default {
    fillDepts, fillUsers, addDept, deleteDept,
    addOffice, deleteOffice, fillOffices
}