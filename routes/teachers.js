var express = require('express');
var router = express.Router();
const {
    getAllTeachers,
    getTeacherByID,
    getTeachersByName,
    addTeacher,
    editTeacher,
    deleteTeacher,
    login,
    getTeacherByClassName,
    changePassword
} = require("../controllers/teacherController");

router.get('/', getTeachersByName, getAllTeachers);

router.get('/:id', getTeacherByID);

router.post('/add', addTeacher);

router.put('/edit/:id', editTeacher);

router.delete('/delete/:id', deleteTeacher);

router.post("/login", login)

router.get("/class_name/:class_name", getTeacherByClassName)

router.put("/change_password/:id", changePassword)

module.exports = router;
