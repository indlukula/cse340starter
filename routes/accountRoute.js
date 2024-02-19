// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const Util = require("../utilities/")

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
  utilities.handleErrors(accountController.account))

// Process the login attempt
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process update
router.get("/update", Util.checkLogin, Util.handleErrors(accountController.update))

router.post("/update", regValidate.updateAccountRules(), regValidate.checkUpdateData, Util.handleErrors(accountController.successUpdateData))

router.post("/change", regValidate.updatePasswordRules(), regValidate.checkUpdateData, Util.handleErrors(accountController.successUpdatePassword))


// Route to build manage account page
router.get(
  "/manage-account",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build update profile page
router.get(
  "/update-profile",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateProfile)
);

// Route to build update password page
router.get(
  "/update-password",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdatePassword)
);

// // Route to build update profile page
// router.post(
//   "/update-profile",
//   regValidate.profileRules(),
//   regValidate.checkProfileData,
//   utilities.handleErrors(accountController.updateProfile)
// );

// // Route to build update password page
// router.post(
//   "/update-password",
//   regValidate.passwordRules(),
//   regValidate.checkPasswordData,
//   utilities.handleErrors(accountController.updatePassword)
// );



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