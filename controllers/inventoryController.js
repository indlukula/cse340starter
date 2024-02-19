const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

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
  
module.exports = invCont