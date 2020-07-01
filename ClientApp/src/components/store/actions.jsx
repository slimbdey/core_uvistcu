///////////////////// DEPARTMENT ///////////////////////////////
const addDept = function (dept) {
    return {
        type: "ADD_DEPT",
        dept
    }
};

const deleteDept = function (id) {
    return {
        type: "DELETE_DEPT",
        id
    }
};

const fillDepts = function (depts, offices, users) {
    return {
        type: "FILL_DEPTS",
        depts,
        offices,
        users
    }
}

///////////////////// OFFICE ///////////////////////////////
const addOffice = function (office) {
    return {
        type: "ADD_OFFICE",
        office
    }
};

const deleteOffice = function (id) {
    return {
        type: "DELETE_OFFICE",
        id
    }
};

const fillOffices = function (offices, users) {
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