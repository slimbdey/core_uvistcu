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

const fillDepts = function (depts) {
    return {
        type: "FILL_DEPTS",
        depts,
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

const fillOffices = function (offices) {
    return {
        type: "FILL_OFFICES",
        offices
    }
}



///////////////////// USER ///////////////////////////////
const addUser = function (user) {
    return {
        type: "ADD_USER",
        user
    }
};

const deleteUser = function (id) {
    return {
        type: "DELETE_USER",
        id
    }
};

const fillUsers = function (users) {
    return {
        type: "FILL_USERS",
        users
    }
}



///////////////////// LABROUR ///////////////////////////////
const addLabour = function (labour) {
    return {
        type: "ADD_LABOUR",
        labour
    }
};

const deleteLabour = function (id) {
    return {
        type: "DELETE_LABOUR",
        id
    }
};

const fillLabours = function (labours) {
    return {
        type: "FILL_LABOURS",
        labours
    }
}



export default {
    fillDepts, addDept, deleteDept,
    addOffice, deleteOffice, fillOffices,
    addUser, deleteUser, fillUsers,
    addLabour, deleteLabour, fillLabours,
}