const express = require("express")
const {login,signup} = require("./authcontroller")


const AuthRouter= express.Router()


AuthRouter.post("/login",login)
AuthRouter.post("/signup",signup)


module.exports = AuthRouter