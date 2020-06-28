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

let fillOffices = function (users, offices) {
    return {
        type: "FILL_OFFICES",
        offices,
        users
    }
}



export default {
    fillDepts, addDept, deleteDept,
    addOffice, deleteOffice, fillOffices
}