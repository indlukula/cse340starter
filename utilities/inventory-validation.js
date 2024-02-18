const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
    return [
      // classification_name alphabet only, no special characters, no spaces
      body("classification_name")
        .trim()
        .isAlpha()
        .withMessage("Valid classification name is required.")
        .isLength({ min: 1 })
        .withMessage("Valid classification name is required.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists){
              throw new Error("Classification name exists. Try a different one.")
            }
        }),
    ]
}

validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

validate.addVehicleRules = () => {
    return [
        body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."),

        body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a model."),
        
        body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."),

        body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide an image path."),

        body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail path."),

        body("inv_price")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a price."),

        body("inv_year")
        .trim()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a valid year."),

        body("inv_miles")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide miles."),

        body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."),
    ]
}

validate.checkAddVehicleData = async (req, res, next) => {
     const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,  inv_color, classification_id} = req.body
    const classificationSelect = await utilities.selectClassification(classification_id)
    let errors = []
    const itemName = `${inv_make} ${inv_model}`
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
            errors,
            inv_id,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
            classification_id
        })
        return
    }
    next()
}
  
/* Edit Inventory errors directs back to edit view*/ 
validate.checkUpdateData = async (req, res, next) => {
     const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,  inv_color, classification_id} = req.body
    const classificationSelect = await utilities.selectClassification(classification_id)
    let errors = []
    const itemName = `${inv_make} ${inv_model}`
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
            errors,
            inv_id,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
            classification_id
        })
        return
    }
    next()
}

module.exports = validate