const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const Teacher = require("../model/Teacher");
const Student = require("../model/Student");

const grantAccessToTeacherAndAdmin = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token){
            return res.status(403).json({
                success: false,
                data: null,
                message: "You need a token to view this source"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user_id = decoded.user_id;

        const existedTeacher = await Teacher.findById(user_id)
        const existedAdmin = await Admin.findById(user_id)

        if (!existedTeacher && !existedAdmin){
            return res.status(403).json({
                success: false,
                data: null,
                message: "Invalid authorization"
            })
        }

        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            data: null,
            message: "Invalid token"
        })
    }
}

const grantAccessToStudentAndAdmin = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token){
            return res.status(403).json({
                success: false,
                data: null,
                message: "You need a token to view this source"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user_id = decoded.user_id;

        const existedStudent = await Student.findById(user_id)
        const existedAdmin = await Admin.findById(user_id)

        if (!existedStudent && !existedAdmin){
            return res.status(403).json({
                success: false,
                data: null,
                message: "Invalid authorization"
            })
        }

        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            data: null,
            message: "Invalid token"
        })
    }
}

const grantAccessToAll = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token){
            return res.status(403).json({
                success: false,
                data: null,
                message: "You need a token to view this source"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;

        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            data: null,
            message: "Invalid token"
        })
    }
}

module.exports = {
    grantAccessToTeacherAndAdmin,
    grantAccessToStudentAndAdmin,
    grantAccessToAll
}