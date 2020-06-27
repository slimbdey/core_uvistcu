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

let fillDepts = function (depts) {
    return {
        type: "FILL_DEPTS",
        depts
    }
}

let fillUsers = function (users) {
    return {
        type: "FILL_USERS",
        users
    }
}

export default { fillDepts, fillUsers, addDept, deleteDept }