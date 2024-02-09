// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build login page
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Route to process register page
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Route to checklogin
router.get(
  "/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement))

// Process the login attempt
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the logout request
router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err)
    } else {
      res.clearCookie("jwt")
      res.redirect("/")
    }
  })
})


module.exports = router