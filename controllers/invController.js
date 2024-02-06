const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildVehicleDetailsPage = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryDetailView(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/detail", {
    title: className,
    nav,
    grid,
  })
}

invCont.buildErrorPage = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryDetailView(data)
  //let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: ' ',
    nav,
    grid,
  })
}

invCont.buildManagement = async function (req, res, next) {
  const links = await utilities.buildManagementLinks()
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: 'Vehicle Management',
    nav,
    links,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropdown = await utilities.getDropDownClassification()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    dropdown,
  })
}

invCont.registerNewClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let links = await utilities.buildManagementLinks()
  const { classification_name } = req.body

  const regResult = await invModel.registerNewClassification(
    classification_name,
  )
  nav = await utilities.getNav()
  if (regResult) {
    req.flash(
      "notice",
      `${classification_name} classification has officially been added!`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      links,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, add new classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

invCont.registerNewVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  let links = await utilities.buildManagementLinks()
  let dropdown = await utilities.getDropDownClassification()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.registerNewVehicle(
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
  )

  if (regResult) {
    req.flash(
      "notice",
      `You registered ${inv_make} ${inv_model} successfully!`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      links,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      dropdown,
    })
  }
}

module.exports = invCont