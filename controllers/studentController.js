const Student = require('../model/Student');
const ROUTE_NAME = "student";
const {encrypt, compare} = require("../utils/encryptor");
const jwt = require("jsonwebtoken");
const {addStudentValidator} = require("../validation/studentValidator");
const getErrorMessage = require("../validation/getErrorMessage");
const {changePasswordValidation} = require("../validation/genericValidation");

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();

        return res.status(200).json({
            success: true,
            data: students
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getStudentsByName = async (req, res, next) => {
    try {
        const {
            student_name
        } = req.query;

        if (student_name == undefined) {
            return next();
        }

        let students = await Student.find();

        students = students.filter(student => {
            return student.name.toLowerCase().includes(student_name.toLowerCase())
        })

        return res.status(200).json({
            success: true,
            data: students
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getStudentByID = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const student = await Student.findById(id);

        return res.status(200).json({
            success: true,
            data: student
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const addStudent = async (req, res) => {
    try {
        let {
            name,
            phone_number,
            dob,
            address,
            email,
            password,
            assigned_classroom
        } = req.body;

        const validation = addStudentValidator.validate({
            name,
            phone_number,
            dob,
            address,
            email,
            password,
            assigned_classroom
        });

        if (validation.error){
            if (validation.error.details[0].path.includes("password")){
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "The password must include at least one upper case letter, one lower case letter, one numeric digit and one special character (#@$!@...)"
                })
            }
    
            if (validation.error.details[0].path.includes("email")){
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "The email must contains @student.com as an address and must be at least five following alphanumeric characters, maybe preceded by a dot"
                })
            }

            return res.status(400).json({
                success: false,
                data: null,
                message: getErrorMessage(validation)
            })
        }

        const existedUser = await Student.findOne({email})

        if (existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: `Please enter a valid email`
            })
        }

        password = encrypt(password);

        const newStudent = await new Student({
            name,
            phone_number,
            dob,
            address,
            email,
            password,
            assigned_classroom,
        }).save()

        return res.status(200).json({
            success: true,
            data: newStudent,
            message: `Successfully created a new ${ROUTE_NAME}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const editStudent = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedStudent = await Student.findById(id);
        if (!existedStudent){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let updatedStudent = await Student.findByIdAndUpdate(id, req.body)
        updatedStudent = await Student.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedStudent,
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

const deleteStudent = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedStudent = await Student.findById(id);
        if (!existedStudent){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let deletedStudent = await Student.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            data: deletedStudent,
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

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const existedUser = await Student.findOne({email});

        if (!existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: "The email or password is wrong"
            })
        }

        if (!compare(password, existedUser.password)){
            return res.status(400).json({
                success: false,
                data: null,
                message: "The email or password is wrong"
            })
        }

        const token = jwt.sign({user_id: existedUser._id}, process.env.JWT_SECRET);

        res.setHeader("x-auth-token", token);
        return res.status(200).json({
            success: true,
            data: existedUser,
            message: `Successfully logged in as ${existedUser.email}`,
            token
        }) 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getStudentByClassName = async (req, res) => {
    try {
        const {
            class_name
        } = req.params;

        let students = await Student.find({assigned_classroom: class_name})

        console.log(students);

        return res.status(200).json({
            success: true,
            data: students
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const {id} = req.params;
        const {oldPassword, newPassword} = req.body;
        
        console.log(req.body)

        const existedUser = await Student.findById(id);

        if (!existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: "No user goes with that ID"
            })
        }

        if (!compare(oldPassword, existedUser.password)){
            return res.status(400).json({
                success: false,
                data: null,
                message: "Invalid password"
            })
        }
        
        const validation = changePasswordValidation.validate({
            newPassword
        });

        if (validation.error){
            if (validation.error.details[0].path.includes("newPassword")){
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "The password must include at least one upper case letter, one lower case letter, one numeric digit and one special character (#@$!@...)"
                })
            } 

            return res.status(400).json({
                success: false,
                data: null,
                message: getErrorMessage(validation)
            })
        }

        const hashedPassword = encrypt(newPassword);

        let updatedStudent = await Student.findByIdAndUpdate(id, {password: hashedPassword});
        updatedStudent = await Student.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedStudent,
            message: "Successfully changed password"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

module.exports = {
    getAllStudents,
    getStudentsByName,
    getStudentByID,
    addStudent,
    editStudent,
    deleteStudent,
    login,
    getStudentByClassName,
    changePassword
}