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

invCont.buildVehicleById = async function (req, res, next) {
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
  const classificationSelect = await utilities.selectClassification()
  res.render("./inventory/management", {
    title: 'Vehicle Management',
    nav,
    links,
    errors: null,
    classificationSelect,
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
  // let dropdown = await utilities.getDropDownClassification()
  let classification = await utilities.selectClassification()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classification,
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
  // let dropdown = await utilities.getDropDownClassification()
  let classification = await utilities.selectClassification()
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
      classification,
    })
  }
}
  

  invCont.buildEditInventoryView = async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const classificationSelect = await utilities.selectClassification(itemData[0].classification_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id

    })
  }

   /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
  invCont.getInventoryJSON = async function (req, res, next) {
    console.log(req.params.classification_id)
    const classification_id = parseInt(req.params.classification_id)
    console.log("This is the class in getInventoryJSON:" + classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    console.log("This is the data from getInventoryJSON:" + invData)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }
  
  //   /* ***************************
  //  *  Return Inventory by Classification As JSON
  //  * ************************** */
  // invCont.getInventoryJSON = async (req, res, next) => {
  //   const classification_id = parseInt(req.params.classification_id);

  //   if (isNaN(classification_id)) {
  //     return next(new Error("Invalid classification_id"));
  //   }

  //   const invData = await invModel.getInventoryByClassificationId(
  //     classification_id
  //   );

  //   return res.json(invData);
  //   };
  
  /* ***************************
 *  Update Inventory Data
 * ************************** */
  invCont.updateInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const inventoryData = req.body
    const updateResult = await invModel.updateInventory(
      inventoryData.inv_id,
      inventoryData.inv_make,
      inventoryData.inv_model,
      inventoryData.inv_description,
      inventoryData.inv_image,
      inventoryData.inv_thumbnail,
      inventoryData.inv_price,
      inventoryData.inv_year,
      inventoryData.inv_miles,
      inventoryData.inv_color,
      inventoryData.classification_id
    )

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.selectClassification(
        inventoryData.classification_id
      )
      const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        ...inventoryData,
      })
    }
  }

  /* ***************************
   *  Delete Inventory Data
   * ************************** */
  invCont.deleteInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
      req.flash("notice", `The delete was successful.`)
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.redirect("/inv/delete/{inv_id}")
    }
}
  
invCont.getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find()
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

invCont.addReview = async (req, res) => {
  const { review_text, inv_id, account_id } = req.body
  const review = new Review({ review_text, inv_id, account_id })
  try {
    const newReview = await review.save()
    res.status(201).json(newReview)
  } catch (error) {
    res.status(400).json({ message: error.message})
  }
}

invCont.updateReview = async (req, res) => {
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].id === review_id) {
      reviews[i].content = newContent
      return "Review updated successfully"
    }
  }
  return "Review not found"
}

invCont.deleteReview = 
  
  invCont.buildDeleteInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
    })
  }
  

module.exports = invCont