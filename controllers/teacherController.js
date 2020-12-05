const Teacher = require("../model/Teacher");
const ROUTE_NAME = "teacher";
const {encrypt, compare} = require("../utils/encryptor");
const jwt = require("jsonwebtoken");
const {addTeacherValidator} = require('../validation/teacherValidator');
const getErrorMessage = require("../validation/getErrorMessage");
const {changePasswordValidation} = require("../validation/genericValidation");

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();

        return res.status(200).json({
            success: true,
            data: teachers
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getTeachersByName = async (req, res, next) => {
    try {
        const {
            teacher_name
        } = req.query;

        if (teacher_name == undefined) {
            return next();
        }

        let teachers = await Teacher.find();

        teachers = teachers.filter(teacher => {
            return teacher.name.toLowerCase().includes(teacher_name.toLowerCase())
        })

        return res.status(200).json({
            success: true,
            data: teachers
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getTeacherByID = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const teacher = await Teacher.findById(id);

        return res.status(200).json({
            success: true,
            data: teacher
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const addTeacher = async (req, res) => {
    try {
        let {
            name,
            phone_number,
            dob,
            address,
            email,
            password,
            assigned_classroom,
        } = req.body;

        const validation = addTeacherValidator.validate({
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
                    message: "The email must contains @teacher.com as an address and must be at least five following alphanumeric characters, maybe preceded by a dot"
                })
            }

            return res.status(400).json({
                success: false,
                data: null,
                message: getErrorMessage(validation)
            })
        }

        let existedUser = await Teacher.findOne({email})

        if (existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: `Please enter a valid email`
            })
        }

        existedUser = await Teacher.findOne({assigned_classroom})

        if (existedUser){
            return res.status(400).json({
                success: false,
                data: null,
                message: `Please assign this teacher to a different classroom`
            })
        }

        password = encrypt(password);

        const newTeacher = await new Teacher({
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
            data: newTeacher,
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

const editTeacher = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedTeacher = await Teacher.findById(id);
        if (!existedTeacher){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body)
        updatedTeacher = await Teacher.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedTeacher,
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

const deleteTeacher = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const existedTeacher = await Teacher.findById(id);
        if (!existedTeacher){
            return res.status(400).json({
                success: false,
                data: null,
                message: `There is no ${ROUTE_NAME} that has the corresponding ID`
            })
        }

        let deletedTeacher = await Teacher.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            data: deletedTeacher,
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

        const existedUser = await Teacher.findOne({email});

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
        return res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        })
    }
}

const getTeacherByClassName = async (req, res) => {
    try {
        const {
            class_name
        } = req.params;

        const teacher = await Teacher.findOne({assigned_classroom: class_name})

        return res.status(200).json({
            success: true,
            data: teacher
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

        const existedUser = await Teacher.findById(id);

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

        let updatedTeacher = await Teacher.findByIdAndUpdate(id, {password: hashedPassword});
        updatedTeacher = await Teacher.findById(id);

        return res.status(200).json({
            success: true,
            data: updatedTeacher,
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
    getAllTeachers,
    getTeachersByName,
    getTeacherByID,
    addTeacher,
    editTeacher,
    deleteTeacher,
    login,
    getTeacherByClassName,
    changePassword
}