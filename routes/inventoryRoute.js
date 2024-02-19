const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classification_Id", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetailsPage));
router.get("/error", utilities.handleErrors(invController.buildErrorPage));
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.get("/get-inventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventoryView))
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventoryView))



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
router.post(
  "/update/",
  invValidate.addVehicleRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to delete inventory item
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteInventory)
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