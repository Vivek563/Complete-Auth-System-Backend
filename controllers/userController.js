import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'
import logger from '../middlewares/log-middleware.js';


class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc, role } = req.body
    const user = await UserModel.findOne({ email: email })
    if (user) {
      logger.log("error", "This is an error message");
      res.send({ "status": "failed", "message": "Email already exists" })
    } else {
      if (name && email && password && password_confirmation && tc ) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
              role: role
            })
            await doc.save()
            const saved_user = await UserModel.findOne({ email: email })
            // Generate JWT Token
            const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
            logger.log("info", `User ${name} registered successfully`);   
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
          } catch (error) {
            console.log(error)
            logger.log("error", `User ${name} registration failed`);
            res.send({ "status": "failed", "message": "Unable to Register" })
          }
        } else {
          logger.log("error", `User ${name} registration failed`);
          res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
        }
      } else {
        logger.log("error", `User ${name} registration failed`);
        res.send({ "status": "failed", "message": "All fields are required" })
      }
    }
  }

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body
      if (email && password) {
        const user = await UserModel.findOne({ email: email })
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if ((user.email === email) && isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
            logger.log("info", `User ${user.name} logged in successfully`);
            res.send({ "status": "success", "message": "Login Success", "token": token })
          } else {
            logger.log("error", `User ${user.name} login failed`);
            res.send({ "status": "failed", "message": "Email or Password is not Valid" })
          }
        } else {
          logger.log("error", `User ${user.name} login failed`);
          res.send({ "status": "failed", "message": "You are not a Registered User" })
        }
      } else {
        logger.log("error", `User ${user.name} login failed`);  
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      // logger.log("error", `User ${user.name} login failed`);
      res.send({ "status": "failed", "message": "Unable to Login" })
    }
  }

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        // logger.log("error", `User ${user.name} password change failed`);
        res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
      } else {
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt)
        await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
        // logger.log("info", `User ${user.name} password changed successfully`);  
        res.send({ "status": "success", "message": "Password changed succesfully" })
      }
    } else {
      // logger.log("error", `User ${user.name} password change failed`);
      res.send({ "status": "failed", "message": "All Fields are Required" })
    }
  }

  static loggedUser = async (req, res) => {
    // logger.log("info", `User ${user.name} logged in successfully`);
    res.send({ "message": 'This route is accessible to authenticated users', "user": req.user })
  }

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
      const user = await UserModel.findOne({ email: email })
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        console.log(link)
        // Send Email
        // let info = await transporter.sendMail({
        //   from: process.env.EMAIL_FROM,
        //   to: user.email,
        //   subject: " Password Reset Link",
        //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
        // })
        // comment out the above code and uncomment the below code to test the API without sending email
        logger.log("info", `User ${user.name} password reset email sent successfully`);
        res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
      } else {
        logger.log("error", `User ${user.name} password reset email sent failed`);
        res.send({ "status": "failed", "message": "Email doesn't exists" })
      }
    } else {
      logger.log("error", `User ${user.name} password reset email sent failed`);
      res.send({ "status": "failed", "message": "Email Field is Required" })
    }
  }

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body
    const { id, token } = req.params
    const user = await UserModel.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          logger.log("error", `User ${user.name} password reset failed`);
          res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
          logger.log("info", `User ${user.name} password reset successfully`);
          res.send({ "status": "success", "message": "Password Reset Successfully" })
        }
      } else {
        logger.log("error", `User ${user.name} password reset failed`);
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      logger.log("error", `User ${user.name} password reset failed`);
      res.send({ "status": "failed", "message": "Invalid Token" })
    }
  }
}

export default UserController