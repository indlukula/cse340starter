// // Needed Resources
// const express = require("express")
// const router = new express.Router()
// const invController = require("../controllers/invController")
// const utilities = require("../utilities")
// const Validate = require('../utilities/inventory-validation')


// // Test route to trigger an error
// router.get("/error", (req, res) => {
//   throw new Error("Test error")
// })

// router.get(
//   "/trigger-error",
//   utilities.handleErrors(invController.triggerError)
// )

// // Route to build inventory by classification view
// router.get(
//   "/type/:classificationId", invController.buildByClassificationId)

// // Route to build vehicle detail view
// router.get(
//   "/detail/:vehicleId",
//   utilities.handleErrors(invController.getVehicleById)
// )

// // Route to inventory management view
// router.get("/", utilities.handleErrors(invController.managementView))

// // Route to build add classification form
// router.get(
//   "/add-classification",
//   utilities.handleErrors(invController.buildAddClassification)
// )
// // Route to post classification form
// router.post(
//   "/add-classification",
//   Validate.addClassificationRules(),
//   Validate.checkClassification,
//   utilities.handleErrors(invController.addNewClassification)
// )

// // Route to build add inventory form
// router.get(
//   "/add-inventory",
//   utilities.handleErrors(invController.buildAddInventory)
// )

// // Route to post inventory form
// router.post(
//   "/add-inventory",
//   Validate.inventoryRules(),
//   Validate.checkInventoryData,
//   utilities.handleErrors(invController.addNewInventory)
// )

// module.exports = router

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetailsPage));
router.get("/error", utilities.handleErrors(invController.buildErrorPage));
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryPage))

router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteView))


router.use(utilities.checkLogin)
router.use(utilities.checkAccountType)

// POST
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkAddClassificationData,
    invController.registerNewClassification
  )

router.post(
    "/add-inventory",
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    invController.registerNewVehicle
)
  
//Post route for the edit inventory page
// router.post(
//     "/update/", 
//     invValidate.addVehicleRules(),
//     invValidate.checkUpdateData,
//     utilities.handleErrors(invController.updateInventory)
// )
  
//Post route for delete page
// router.post(
//   "/delete", 
//   invController.deleteItem)


module.exports = router;

// router.get("/", (req, res) => {
//   res.render("inventory/management", {
//     title: "Inventory Management",
//     page: "inventory",
//   });
// });