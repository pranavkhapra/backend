const Class = require("../model/Class");
const Teacher = require("../model/Teacher");
const Student = require('../model/Student');
const ROUTE_NAME = "class";

const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();

        return res.status(200).json({
            success: true,
            data: classes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getClassByClassName = async (req, res, next) => {
    try {
        const {class_name} = req.query;

        if (class_name == undefined){
            return next();
        }

        const classes = await Class.findOne({class_name});

        return res.status(200).json({
            success: true,
            data: classes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getClassByID = async (req, res) => {
    try {
        const {id} = req.params;
        const classes = await Class.findById(id);

        return res.status(200).json({
            success: true,
            data: classes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const addClass = async (req, res) => {
    try {
        let {class_name} = req.body;
        
        const existedClass = await Class.findOne({class_name})

        if (existedClass){
            return res.status(400).json({
                success: false,
                data: null,
                message: `A ${ROUTE_NAME} have already existed with that name`
            })
        }

        const newClass = await new Class({class_name}).save()

        return res.status(200).json({
            success: true,
            data: newClass,
            message: `Successfully created a new ${ROUTE_NAME}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const editClass = async (req, res) => {
    try {
        const {id} = req.params;

        const existedClass = await Class.findById(id);

        if (!existedClass){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let updatedClass = await Class.findByIdAndUpdate(id, req.body)
        updatedClass = await Class.findById(id);
        
        let teachers = await Teacher.find();
        teachers = teachers.map(teacher => {
            if (teacher.assigned_classroom == updatedClass.class_name) {
                teacher.assigned_classroom = updatedClass.class_name
            }
            return teacher
        })

        let students = await Student.find();

        students = students.map(student => {
            if (student.assigned_classroom == updatedClass.class_name) {
                student.assigned_classroom = updatedClass.class_name
            }
            return student
        })

        return res.status(200).json({
            success: true,
            data: updatedClass,
            message: `Successfully updated a new ${ROUTE_NAME}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const deleteClass = async (req, res) => {
    try {
        const {id} = req.params;

        const existedClass = await Class.findById(id);
        if (!existedClass){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let isClassInUsed = false;

        let teachers = await Teacher.find();
        teachers.forEach(teacher => {
            if (teacher.assigned_classroom == updatedClass.class_name) {
                isClassInUsed = true;
            }
        })

        let students = await Student.find();
        students.forEach(student => {
            if (student.assigned_classroom == updatedClass.class_name) {
                isClassInUsed = true;
            }
        })

        if (isClassInUsed){
            return res.status(400).json({
                success: false,
                data: null,
                message: `The ${ROUTE_NAME} is already in used`
            })
        }

        let deletedClass = await Class.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            data: deletedClass,
            message: `Successfully deleted a new ${ROUTE_NAME}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

module.exports = {
    getAllClasses,
    getClassByClassName,
    getClassByID,
    addClass,
    editClass,
    deleteClass
}