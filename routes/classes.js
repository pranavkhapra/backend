var express = require('express');
var router = express.Router();
const {
    getClassByClassName,
    getAllClasses,
    getClassByID,
    addClass,
    editClass,
    deleteClass
} = require("../controllers/classController");

router.get('/', getClassByClassName, getAllClasses);

router.get('/:id', getClassByID);

router.post('/add', addClass);

router.put('/edit/:id', editClass);

router.delete('/delete/:id', deleteClass);

module.exports = router;
