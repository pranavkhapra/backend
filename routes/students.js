var express = require('express');
var router = express.Router();
const {
    getAllStudents,
    getStudentsByName,
    getStudentByID,
    addStudent,
    editStudent,
    deleteStudent,
    login,
    getStudentByClassName,
    changePassword
} = require("../controllers/studentController");

router.get('/', getStudentsByName, getAllStudents);

router.get('/:id', getStudentByID);

router.post('/add', addStudent);

router.put('/edit/:id', editStudent);

router.delete('/delete/:id', deleteStudent);

router.post("/login", login)

router.get("/class_name/:class_name", getStudentByClassName)

router.put("/change_password/:id", changePassword)

module.exports = router;
